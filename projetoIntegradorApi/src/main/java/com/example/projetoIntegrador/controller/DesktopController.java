package com.example.projetoIntegrador.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.text.Normalizer;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Contratos exclusivos do Electron para substituir os acessos MySQL diretos.
 * As rotas já usadas pelo web e pelo mobile não são alteradas.
 */
@RestController
@RequestMapping("/api/desktop")
public class DesktopController {

    private final JdbcTemplate jdbc;

    public DesktopController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/prontuarios")
    public List<Map<String, Object>> buscarProntuarios(
            @RequestParam(required = false) Long idPaciente,
            @RequestParam(required = false) Long idMedico) {
        StringBuilder sql = new StringBuilder("SELECT * FROM prontuario WHERE 1=1");
        List<Object> params = new ArrayList<>();
        if (idPaciente != null) { sql.append(" AND id_paciente = ?"); params.add(idPaciente); }
        if (idMedico != null) { sql.append(" AND id_medico = ?"); params.add(idMedico); }
        sql.append(" ORDER BY id DESC");
        return jdbc.queryForList(sql.toString(), params.toArray());
    }

    @GetMapping("/prontuarios/recente")
    public ResponseEntity<Map<String, Object>> prontuarioRecente(@RequestParam Long idPaciente) {
        List<Map<String, Object>> rows = jdbc.queryForList(
                "SELECT * FROM prontuario WHERE id_paciente = ? ORDER BY id DESC LIMIT 1", idPaciente);
        return rows.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(rows.get(0));
    }

    @PostMapping("/prontuarios")
    public Map<String, Object> cadastrarProntuario(@RequestBody Map<String, Object> body) {
        long id = inserirComId("""
            INSERT INTO prontuario (
              id_medico, id_paciente, nome_paciente, idade, condicao, ultima_visita,
              status, tipo, cid10, anamnese, exame_fisico, conduta, data_retorno,
              pa, temperatura, peso, spo2
            ) VALUES (?, ?, ?, ?, ?, ?, 'Ativo', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, java.util.Arrays.asList(
                body.get("idMedico"), body.get("idPaciente"), body.get("nomePaciente"), body.get("idade"),
                body.get("diagnostico"), body.get("dataAtendimento"), body.get("tipo"), body.get("cid10"),
                body.get("anamnese"), body.get("exameFisico"), body.get("conduta"), body.get("dataRetorno"),
                body.get("pa"), body.get("temperatura"), body.get("peso"), body.get("spo2")
        ));
        return Map.of("id", id);
    }

    @GetMapping("/receitas")
    public List<Map<String, Object>> buscarReceitas(@RequestParam Long idPaciente, @RequestParam Long idMedico) {
        return jdbc.queryForList("""
            SELECT * FROM receita
            WHERE id_paciente = ? AND id_medico = ?
            ORDER BY id DESC
            """, idPaciente, idMedico);
    }

    @PostMapping("/receitas")
    public Map<String, Object> cadastrarReceita(@RequestBody Map<String, Object> body) {
        long id = inserirComId("""
            INSERT INTO receita (
              id_medico, id_paciente, medicamento, concentracao, dosagem, frequencia,
              duracao, via_administracao, instrucoes, observacoes, status, data_prescricao
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Ativa', ?)
            """, java.util.Arrays.asList(
                body.get("idMedico"), body.get("idPaciente"), body.get("medicamento"), body.get("concentracao"),
                body.get("dosagem"), body.get("frequencia"), body.get("duracao"), body.get("viaAdministracao"),
                body.get("instrucoes"), body.get("observacoes"),
                body.getOrDefault("dataPrescricao", LocalDate.now().toString())
        ));
        return Map.of("id", id);
    }

    @GetMapping("/parceiros")
    public List<Map<String, Object>> buscarParceiros(@RequestParam Long idMedico) {
        List<Map<String, Object>> parceiros = jdbc.queryForList("""
            SELECT p.id, p.nome, p.tipo, p.email, p.telefone, p.desconto, p.status,
                   DATE_FORMAT(p.data_inicio, '%d/%m/%Y') AS dataInicio,
                   (SELECT COUNT(*) FROM parceiro_encaminhamentos pe
                    WHERE pe.id_parceiro = p.id
                      AND MONTH(pe.data_encaminhamento) = MONTH(CURDATE())
                      AND YEAR(pe.data_encaminhamento) = YEAR(CURDATE())) AS encaminhamentosMes
            FROM parceiros p WHERE p.id_medico = ? ORDER BY p.nome
            """, idMedico);
        List<Map<String, Object>> servicos = jdbc.queryForList("""
            SELECT ps.id_parceiro, ps.nome_servico
            FROM parceiro_servicos ps
            INNER JOIN parceiros p ON p.id = ps.id_parceiro
            WHERE p.id_medico = ?
            """, idMedico);

        for (Map<String, Object> parceiro : parceiros) {
            Object id = parceiro.get("id");
            List<String> nomes = servicos.stream()
                    .filter(s -> String.valueOf(s.get("id_parceiro")).equals(String.valueOf(id)))
                    .map(s -> String.valueOf(s.get("nome_servico")))
                    .toList();
            parceiro.put("servicos", nomes);
        }
        return parceiros;
    }

    @PostMapping("/parceiros")
    public Map<String, Object> cadastrarParceiro(@RequestBody Map<String, Object> body) {
        long id = inserirComId("""
            INSERT INTO parceiros (id_medico, nome, tipo, email, telefone, desconto, status, data_inicio)
            VALUES (?, ?, ?, ?, ?, ?, 'ativo', STR_TO_DATE(?, '%d/%m/%Y'))
            """, java.util.Arrays.asList(body.get("idMedico"), body.get("parceiro"), body.get("tipo"), body.get("email"),
                body.get("telefone"), body.get("desconto"), body.get("dataInicio")));
        return Map.of("id", id);
    }

    @PatchMapping("/parceiros/{id}/status")
    public void atualizarStatusParceiro(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        jdbc.update("UPDATE parceiros SET status = ? WHERE id = ?", body.get("status"), id);
    }

    @PatchMapping("/parceiros/{id}/desconto")
    public void atualizarDescontoParceiro(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        jdbc.update("UPDATE parceiros SET desconto = ? WHERE id = ?", body.get("desconto"), id);
    }

    @PostMapping("/parceiros/{id}/servicos")
    public Map<String, Object> adicionarServico(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        long result = inserirComId("""
            INSERT INTO parceiro_servicos (id_parceiro, nome_servico, categoria, descricao)
            VALUES (?, ?, ?, ?)
            """, java.util.Arrays.asList(id, body.get("nomeServico"), body.get("categoria"), body.get("descricao")));
        return Map.of("id", result);
    }

    @PostMapping("/parceiros/{id}/encaminhamentos")
    public void encaminharPaciente(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        jdbc.update("INSERT INTO parceiro_encaminhamentos (id_parceiro, id_paciente) VALUES (?, ?)",
                id, body.get("idPaciente"));
    }

    @GetMapping("/medicos/{idMedico}/pacientes")
    public List<Map<String, Object>> pacientesDoMedico(@PathVariable Long idMedico) {
        return jdbc.queryForList("""
            SELECT DISTINCT pac.id, pac.nome AS nome_paciente, pac.nome,
                   pac.idade, pac.CPF, pac.data_nascimento,
                   (SELECT pr.condicao FROM prontuario pr WHERE pr.id_paciente = pac.id ORDER BY pr.id DESC LIMIT 1) AS condicao,
                   (SELECT pr.ultima_visita FROM prontuario pr WHERE pr.id_paciente = pac.id ORDER BY pr.id DESC LIMIT 1) AS ultima_visita,
                   (SELECT pr.status FROM prontuario pr WHERE pr.id_paciente = pac.id ORDER BY pr.id DESC LIMIT 1) AS status
            FROM paciente pac
            INNER JOIN teleconsulta tc ON tc.id_paciente = pac.id
            WHERE tc.id_medico = ? ORDER BY pac.nome
            """, idMedico);
    }

    @PatchMapping("/teleconsultas/{id}/reagendar")
    public void reagendarTeleconsulta(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        jdbc.update("UPDATE teleconsulta SET data = ?, horario = ?, duracao = ? WHERE id = ?",
                body.get("novaData"), body.get("novoHorario"), body.get("novaDuracao"), id);
    }

    @GetMapping("/relatorios")
    public List<Map<String, Object>> buscarRelatorios(@RequestParam Long idPaciente, @RequestParam Long idMedico) {
        return jdbc.queryForList("""
            SELECT id, id_paciente, id_medico, titulo, tipo, data
            FROM relatorios WHERE id_paciente = ? AND id_medico = ? ORDER BY id DESC
            """, idPaciente, idMedico);
    }

    @GetMapping("/relatorios/{id}/arquivo")
    public ResponseEntity<Map<String, Object>> arquivoRelatorio(@PathVariable Long id) {
        List<Map<String, Object>> rows = jdbc.queryForList("SELECT arquivo, titulo FROM relatorios WHERE id = ?", id);
        if (rows.isEmpty() || !(rows.get(0).get("arquivo") instanceof byte[] arquivo)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of(
                "titulo", String.valueOf(rows.get(0).get("titulo")),
                "arquivoBase64", Base64.getEncoder().encodeToString(arquivo)));
    }

    @PostMapping("/relatorios")
    public Map<String, Object> salvarRelatorio(@RequestBody Map<String, Object> body) {
        byte[] arquivo = Base64.getDecoder().decode(String.valueOf(body.get("arquivoBase64")));
        long id = inserirComId("""
            INSERT INTO relatorios (id_paciente, id_medico, titulo, tipo, data, arquivo)
            VALUES (?, ?, ?, ?, ?, ?)
            """, java.util.Arrays.asList(body.get("idPaciente"), body.get("idMedico"), body.get("titulo"),
                body.getOrDefault("tipo", "PDF"), body.get("data"), arquivo));
        return Map.of("id", id);
    }

    @DeleteMapping("/relatorios/{id}")
    public void deletarRelatorio(@PathVariable Long id) {
        jdbc.update("DELETE FROM relatorios WHERE id = ?", id);
    }

    @GetMapping("/dashboard/{idFarmacia}")
    public Map<String, Object> dashboard(@PathVariable Long idFarmacia) {
        Number totalEstoque = jdbc.queryForObject(
                "SELECT COALESCE(SUM(quantidade), 0) FROM produtos WHERE id_farmacia = ?", Number.class, idFarmacia);
        List<Map<String, Object>> alertas = jdbc.queryForList("""
            SELECT l.*, p.nome AS nome_produto FROM lotes l
            JOIN produtos p ON p.id = l.id_produto
            WHERE p.id_farmacia = ? AND l.data_validade IS NOT NULL
              AND l.data_validade BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
            ORDER BY l.data_validade ASC
            """, idFarmacia);
        List<Map<String, Object>> estoqueBaixo = jdbc.queryForList("""
            SELECT * FROM produtos WHERE id_farmacia = ? AND quantidade < estoque_min
            ORDER BY quantidade ASC LIMIT 5
            """, idFarmacia);
        List<Map<String, Object>> vendas = jdbc.queryForList(
                "SELECT total, data_venda FROM vendas_concluidas WHERE id_farmacia = ?", idFarmacia);

        BigDecimal vendasDoMes = somarVendas(vendas, YearMonth.now());
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalEstoque", totalEstoque);
        result.put("totalAlertasValidade", alertas.size());
        result.put("vendasDoMes", vendasDoMes);
        result.put("proximosVencimento", alertas.stream().limit(3).toList());
        result.put("estoqueBaixo", estoqueBaixo);
        return result;
    }

    @GetMapping("/relatorios-farmacia/dados")
    public List<Map<String, Object>> dadosRelatorio(@RequestParam String tipo,
                                                    @RequestParam String periodo,
                                                    @RequestParam Long idFarmacia) {
        if ("estoque".equals(tipo)) {
            return jdbc.queryForList("""
                SELECT nome, categoria, quantidade, estoque_min, preco, fornecedor
                FROM produtos WHERE id_farmacia = ? ORDER BY nome ASC
                """, idFarmacia);
        }
        if ("validade".equals(tipo)) {
            int dias = diasDoPeriodo(periodo);
            if (dias == 0) {
                return jdbc.queryForList("""
                    SELECT p.nome, l.numero_lote, l.quantidade, l.data_validade, l.prateleira
                    FROM lotes l JOIN produtos p ON p.id = l.id_produto
                    WHERE p.id_farmacia = ? AND l.data_validade IS NOT NULL ORDER BY l.data_validade ASC
                    """, idFarmacia);
            }
            return jdbc.queryForList("""
                SELECT p.nome, l.numero_lote, l.quantidade, l.data_validade, l.prateleira
                FROM lotes l JOIN produtos p ON p.id = l.id_produto
                WHERE p.id_farmacia = ? AND l.data_validade BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
                ORDER BY l.data_validade ASC
                """, idFarmacia, dias);
        }
        if ("vendas".equals(tipo)) {
            List<Map<String, Object>> vendas = jdbc.queryForList("""
                SELECT cliente, total, quantidade, metodo_pago, data_venda
                FROM vendas_concluidas WHERE id_farmacia = ?
                """, idFarmacia);
            int dias = diasDoPeriodo(periodo);
            if (dias == 0) return vendas;
            LocalDate inicio = LocalDate.now().minusDays(dias);
            return vendas.stream().filter(v -> dataVenda(v.get("data_venda"))
                    .map(data -> !data.isBefore(inicio) && !data.isAfter(LocalDate.now())).orElse(false)).toList();
        }
        return List.of();
    }

    @PostMapping("/relatorios-farmacia")
    public Map<String, Object> salvarRelatorioFarmacia(@RequestBody Map<String, Object> body) {
        byte[] arquivo = Base64.getDecoder().decode(String.valueOf(body.get("arquivoBase64")));
        long id = inserirComId("""
            INSERT INTO relatorios_farmacia
              (tipo, periodo, formato, nome_arquivo, caminho, tamanho_kb, id_farmacia, arquivo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, java.util.Arrays.asList(body.get("tipo"), body.get("periodo"), body.get("formato"), body.get("nomeArquivo"),
                body.get("caminho"), body.get("tamanhoKb"), body.get("idFarmacia"), arquivo));
        return Map.of("id", id);
    }

    @GetMapping("/relatorios-farmacia")
    public List<Map<String, Object>> buscarRelatoriosFarmacia(@RequestParam Long idFarmacia) {
        return jdbc.queryForList("""
            SELECT id, tipo, periodo, formato, nome_arquivo, caminho, tamanho_kb, gerado_em, id_farmacia
            FROM relatorios_farmacia WHERE id_farmacia = ? ORDER BY gerado_em DESC LIMIT 10
            """, idFarmacia);
    }

    @GetMapping("/relatorios-farmacia/{id}/arquivo")
    public ResponseEntity<Map<String, Object>> arquivoRelatorioFarmacia(@PathVariable Long id,
                                                                        @RequestParam Long idFarmacia) {
        List<Map<String, Object>> rows = jdbc.queryForList("""
            SELECT nome_arquivo, caminho, arquivo FROM relatorios_farmacia
            WHERE id = ? AND id_farmacia = ?
            """, id, idFarmacia);
        if (rows.isEmpty()) return ResponseEntity.notFound().build();
        Map<String, Object> row = rows.get(0);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("nomeArquivo", row.get("nome_arquivo"));
        result.put("caminho", row.get("caminho"));
        if (row.get("arquivo") instanceof byte[] arquivo) {
            result.put("arquivoBase64", Base64.getEncoder().encodeToString(arquivo));
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/relatorios-farmacia/resumo")
    public Map<String, Object> resumoRelatorios(@RequestParam Long idFarmacia) {
        Number totalEstoque = jdbc.queryForObject(
                "SELECT COALESCE(SUM(quantidade), 0) FROM produtos WHERE id_farmacia = ?", Number.class, idFarmacia);
        Number totalAlertas = jdbc.queryForObject("""
            SELECT COUNT(*) FROM lotes l JOIN produtos p ON p.id = l.id_produto
            WHERE p.id_farmacia = ? AND l.data_validade IS NOT NULL
              AND l.data_validade BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)
            """, Number.class, idFarmacia);
        List<Map<String, Object>> vendas = jdbc.queryForList(
                "SELECT total, data_venda FROM vendas_concluidas WHERE id_farmacia = ?", idFarmacia);
        BigDecimal atual = somarVendas(vendas, YearMonth.now());
        BigDecimal anterior = somarVendas(vendas, YearMonth.now().minusMonths(1));
        Integer variacao = anterior.signum() > 0
                ? atual.subtract(anterior).multiply(BigDecimal.valueOf(100)).divide(anterior, 0, java.math.RoundingMode.HALF_UP).intValue()
                : null;
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalEstoque", totalEstoque);
        result.put("vendasMesAtual", atual);
        result.put("variacaoVendas", variacao);
        result.put("totalAlertas", totalAlertas);
        return result;
    }

    @PostMapping("/receitas-controladas")
    public Map<String, Object> cadastrarReceitaControlada(@RequestBody Map<String, Object> body) {
        long id = inserirComId("""
            INSERT INTO receitas_controladas
              (cpf_cliente, nome_cliente, produto_nome, nome_medico, crm, uf_crm,
               nome_paciente, cpf_paciente, tipo_receita, numero_receita, data_receita,
               original_conferida, documento_verificado, observacoes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, java.util.Arrays.asList(body.get("cpfCliente"), body.get("nomeCliente"), body.get("produtoNome"),
                body.get("nomeMedico"), body.get("crm"), body.get("ufCrm"), body.get("nomePaciente"),
                body.get("cpfPaciente"), body.get("tipoReceita"), body.get("numeroReceita"), body.get("dataReceita"),
                Boolean.TRUE.equals(body.get("originalConferida")) ? 1 : 0,
                Boolean.TRUE.equals(body.get("documentoVerificado")) ? 1 : 0, body.get("observacoes")));
        return Map.of("id", id);
    }

    @GetMapping("/farmacias/{id}")
    public ResponseEntity<Map<String, Object>> buscarFarmacia(@PathVariable Long id) {
        List<Map<String, Object>> rows = jdbc.queryForList("SELECT * FROM farmacia WHERE id = ?", id);
        return rows.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(rows.get(0));
    }

    private long inserirComId(String sql, List<Object> params) {
        KeyHolder key = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            for (int i = 0; i < params.size(); i++) statement.setObject(i + 1, params.get(i));
            return statement;
        }, key);
        return key.getKey() == null ? 0 : key.getKey().longValue();
    }

    private int diasDoPeriodo(String periodo) {
        String valor = Normalizer.normalize(periodo == null ? "" : periodo, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT);
        if (valor.contains("semana")) return 7;
        if (valor.contains("3 meses")) return 90;
        if (valor.contains("mes")) return 30;
        return 0;
    }

    private BigDecimal somarVendas(List<Map<String, Object>> vendas, YearMonth mes) {
        return vendas.stream()
                .filter(v -> dataVenda(v.get("data_venda")).map(d -> YearMonth.from(d).equals(mes)).orElse(false))
                .map(v -> valorDecimal(v.get("total")))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal valorDecimal(Object valor) {
        if (valor == null) return BigDecimal.ZERO;
        try {
            return new BigDecimal(String.valueOf(valor));
        } catch (NumberFormatException ignored) {
            return BigDecimal.ZERO;
        }
    }

    private java.util.Optional<LocalDate> dataVenda(Object valor) {
        try {
            return java.util.Optional.of(LocalDate.parse(String.valueOf(valor), DateTimeFormatter.ofPattern("dd/MM/yyyy")));
        } catch (Exception ignored) {
            return java.util.Optional.empty();
        }
    }
}
