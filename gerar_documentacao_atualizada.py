from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.platypus.tableofcontents import TableOfContents


ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "Documentacao - FarmaGrid+ - Atualizada.pdf"
LOGO = ROOT / "FarmaGrid+_MOBILE" / "assets" / "images" / "logo.png"

GREEN = colors.HexColor("#2F6B4F")
GREEN_DARK = colors.HexColor("#1F4D39")
GREEN_LIGHT = colors.HexColor("#E8F2ED")
GOLD = colors.HexColor("#D6A84B")
INK = colors.HexColor("#24302A")
GRAY = colors.HexColor("#66736C")
LIGHT = colors.HexColor("#F5F7F6")
RED = colors.HexColor("#A63D40")
AMBER = colors.HexColor("#9A6A12")


def register_fonts():
    candidates = [
        ("DocSans", r"C:\Windows\Fonts\arial.ttf", r"C:\Windows\Fonts\arialbd.ttf"),
        ("DocSans", r"C:\Windows\Fonts\calibri.ttf", r"C:\Windows\Fonts\calibrib.ttf"),
    ]
    for name, regular, bold in candidates:
        if Path(regular).exists() and Path(bold).exists():
            pdfmetrics.registerFont(TTFont(name, regular))
            pdfmetrics.registerFont(TTFont(name + "-Bold", bold))
            pdfmetrics.registerFontFamily(name, normal=name, bold=name + "-Bold")
            return name
    return "Helvetica"


FONT = register_fonts()
FONT_BOLD = FONT + "-Bold" if FONT != "Helvetica" else "Helvetica-Bold"


class FarmaDocTemplate(BaseDocTemplate):
    def __init__(self, filename):
        super().__init__(
            filename,
            pagesize=A4,
            rightMargin=2.0 * cm,
            leftMargin=2.0 * cm,
            topMargin=2.2 * cm,
            bottomMargin=2.0 * cm,
            title="Documentação Atualizada — FarmaGrid+",
            author="Ana Carolina Lanzoni; Heloisa Pola Argentin; Gabriel Andreolli Aires",
            subject="Documentação técnica e funcional conforme o repositório do FarmaGrid+",
        )
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height, id="body")
        self.addPageTemplates(PageTemplate(id="normal", frames=[frame], onPage=draw_page))

    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph):
            level = getattr(flowable.style, "toc_level", None)
            if level is not None:
                text = flowable.getPlainText()
                key = f"h-{self.seq.nextf('heading')}"
                self.canv.bookmarkPage(key)
                self.canv.addOutlineEntry(text, key, level=level, closed=False)
                self.notify("TOCEntry", (level, text, self.page, key))


def draw_page(canvas, doc):
    if doc.page == 1:
        return
    canvas.saveState()
    canvas.setStrokeColor(GREEN_LIGHT)
    canvas.line(2 * cm, A4[1] - 1.35 * cm, A4[0] - 2 * cm, A4[1] - 1.35 * cm)
    canvas.setFont(FONT, 8)
    canvas.setFillColor(GRAY)
    canvas.drawString(2 * cm, A4[1] - 1.08 * cm, "FarmaGrid+ — documentação conforme o código-fonte")
    canvas.drawRightString(A4[0] - 2 * cm, 1.05 * cm, f"Página {doc.page}")
    canvas.restoreState()


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="BodyDoc", parent=styles["BodyText"], fontName=FONT, fontSize=10.2,
    leading=15, textColor=INK, alignment=TA_JUSTIFY, spaceAfter=7,
))
styles.add(ParagraphStyle(
    name="H1Doc", parent=styles["Heading1"], fontName=FONT_BOLD, fontSize=18,
    leading=22, textColor=GREEN_DARK, spaceBefore=10, spaceAfter=12, toc_level=0,
))
styles.add(ParagraphStyle(
    name="H2Doc", parent=styles["Heading2"], fontName=FONT_BOLD, fontSize=13.5,
    leading=17, textColor=GREEN, spaceBefore=10, spaceAfter=7, toc_level=1,
))
styles.add(ParagraphStyle(
    name="H3Doc", parent=styles["Heading3"], fontName=FONT_BOLD, fontSize=11,
    leading=14, textColor=INK, spaceBefore=7, spaceAfter=4,
))
styles.add(ParagraphStyle(
    name="SmallDoc", parent=styles["BodyText"], fontName=FONT, fontSize=8.4,
    leading=11, textColor=INK,
))
styles.add(ParagraphStyle(
    name="CellDoc", parent=styles["BodyText"], fontName=FONT, fontSize=7.7,
    leading=10, textColor=INK,
))
styles.add(ParagraphStyle(
    name="CellHead", parent=styles["BodyText"], fontName=FONT_BOLD, fontSize=8,
    leading=10, textColor=colors.white, alignment=TA_LEFT,
))
styles.add(ParagraphStyle(
    name="CoverTitle", parent=styles["Title"], fontName=FONT_BOLD, fontSize=22,
    leading=29, textColor=GREEN_DARK, alignment=TA_CENTER,
))
styles.add(ParagraphStyle(
    name="CoverSub", parent=styles["BodyText"], fontName=FONT, fontSize=12,
    leading=17, textColor=GRAY, alignment=TA_CENTER,
))
styles.add(ParagraphStyle(
    name="Callout", parent=styles["BodyText"], fontName=FONT, fontSize=9.3,
    leading=13, textColor=GREEN_DARK, backColor=GREEN_LIGHT, borderColor=GREEN,
    borderWidth=0.7, borderPadding=9, spaceBefore=6, spaceAfter=10,
))
styles.add(ParagraphStyle(
    name="BulletDoc", parent=styles["BodyText"], fontName=FONT, fontSize=9.8,
    leading=14, textColor=INK, leftIndent=14, firstLineIndent=-8, spaceAfter=3,
))


def P(text, style="BodyDoc"):
    return Paragraph(text, styles[style])


def heading(text, level=1):
    return P(text, "H1Doc" if level == 1 else "H2Doc" if level == 2 else "H3Doc")


def bullets(items):
    out = []
    for item in items:
        out.append(P("• " + item, "BulletDoc"))
    return out


def cell(value, header=False):
    if isinstance(value, Paragraph):
        return value
    return P(escape(str(value)), "CellHead" if header else "CellDoc")


def table(headers, rows, widths=None, repeat=1, status_col=None):
    data = [[cell(x, True) for x in headers]] + [[cell(x) for x in row] for row in rows]
    t = Table(data, colWidths=widths, repeatRows=repeat, hAlign="LEFT")
    commands = [
        ("BACKGROUND", (0, 0), (-1, 0), GREEN),
        ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#B9C6BF")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    for idx in range(1, len(data)):
        if idx % 2 == 0:
            commands.append(("BACKGROUND", (0, idx), (-1, idx), LIGHT))
    if status_col is not None:
        for idx, row in enumerate(rows, start=1):
            status = str(row[status_col]).lower()
            bg = GREEN_LIGHT if "implement" in status else colors.HexColor("#FFF4DB") if "parcial" in status or "demonstr" in status else colors.HexColor("#FBEAEA")
            commands.append(("BACKGROUND", (status_col, idx), (status_col, idx), bg))
    t.setStyle(TableStyle(commands))
    return t


story = []

# Capa
story += [Spacer(1, 1.6 * cm)]
if LOGO.exists():
    img = Image(str(LOGO), width=3.2 * cm, height=3.2 * cm)
    img.hAlign = "CENTER"
    story += [img, Spacer(1, 0.5 * cm)]
story += [
    P("UNIVERSIDADE ESTADUAL DE CAMPINAS", "CoverSub"),
    P("COLÉGIO TÉCNICO DE LIMEIRA", "CoverSub"),
    Spacer(1, 1.8 * cm),
    P("FARMAGRID+", "CoverTitle"),
    Spacer(1, 0.35 * cm),
    P("Plataforma digital integrada para gestão farmacêutica, teleconsultas e acompanhamento clínico", "CoverTitle"),
    Spacer(1, 0.8 * cm),
    P("DOCUMENTAÇÃO TÉCNICA E FUNCIONAL — VERSÃO ATUALIZADA CONFORME O REPOSITÓRIO", "CoverSub"),
    Spacer(1, 2.0 * cm),
    P("Ana Carolina Lanzoni<br/>Heloisa Pola Argentin<br/>Gabriel Andreolli Aires", "CoverSub"),
    Spacer(1, 2.0 * cm),
    P("Limeira<br/>2026", "CoverSub"),
    PageBreak(),
]

# Folha de rosto e nota de revisão
story += [
    heading("Identificação do trabalho", 1),
    P("Trabalho de conclusão de curso apresentado como requisito para obtenção do Diploma de Habilitação Técnica em Desenvolvimento de Sistemas pelo Colégio Técnico de Limeira — COTIL/UNICAMP."),
    table(
        ["Item", "Informação"],
        [
            ["Projeto", "FarmaGrid+"],
            ["Autores", "Ana Carolina Lanzoni; Heloisa Pola Argentin; Gabriel Andreolli Aires"],
            ["Orientação", "Priscila Keli Lima Pinto Frizzarin"],
            ["Versão desta documentação", "2.0 — revisão de aderência ao código"],
            ["Data da auditoria", "22 de setembro de 2026"],
            ["Base da revisão", "Arquivos presentes no repositório local, sem considerar o PDF anterior como especificação obrigatória"],
        ],
        widths=[4.5 * cm, 11.8 * cm],
    ),
    Spacer(1, 0.4 * cm),
    P("<b>Nota de revisão.</b> Esta versão diferencia recursos implementados, parciais/demonstrativos e não implementados. Afirmações de funcionamento foram limitadas ao que é sustentado pelo código-fonte e pelas validações executadas. O PDF anterior foi usado somente como material de comparação.", "Callout"),
    PageBreak(),
]

# Sumário
story += [heading("Sumário", 1)]
toc = TableOfContents()
toc.levelStyles = [
    ParagraphStyle(name="TOC1", fontName=FONT_BOLD, fontSize=10.5, leading=15, textColor=GREEN_DARK, leftIndent=0, firstLineIndent=0, spaceBefore=4),
    ParagraphStyle(name="TOC2", fontName=FONT, fontSize=9.2, leading=13, textColor=INK, leftIndent=18, firstLineIndent=0),
]
story += [toc, PageBreak()]

# Resumo
story += [
    heading("Resumo", 1),
    P("O FarmaGrid+ é um protótipo acadêmico multiplataforma que integra uma API REST em Java/Spring Boot, um aplicativo Flutter, um portal React/Vite e um cliente desktop Electron. O conjunto implementa autenticação, perfis de paciente e médico, teleconsultas agendadas, prontuários, receitas, exames, farmácias próximas, cupons, estoque por produtos e lotes, controle de validade, funcionários, clientes de farmácia, caixa, vendas, parcerias e relatórios. A solução usa MySQL, JPA, JWT, chamadas HTTP, armazenamento seguro no aplicativo móvel e, no desktop, integrações adicionais com banco direto, geração de PDF/planilhas e IA generativa."),
    P("A auditoria também identificou limites relevantes: não existe hardware ou comunicação IoT; não há central de suporte; não existe serviço real de notificações; pagamentos e assinaturas não usam gateway; a videoconferência é feita por link externo; a loja do portal e seu checkout são simulações locais; o cadastro web de farmácia é demonstrativo; e algumas telas móveis utilizam dados estáticos ou fallback. Portanto, a plataforma deve ser apresentada como protótipo funcional em evolução, e não como produto de saúde pronto para produção."),
    P("<b>Palavras-chave:</b> saúde digital; gestão farmacêutica; teleconsulta; prontuário eletrônico; prescrição; Flutter; Electron; React; Spring Boot."),
    heading("1. Introdução", 1),
    P("A fragmentação de informações entre pacientes, profissionais de saúde e farmácias dificulta o acompanhamento clínico e a gestão de medicamentos. O FarmaGrid+ propõe centralizar parte desses fluxos em interfaces direcionadas a diferentes perfis: pacientes e médicos no aplicativo móvel, pacientes no portal web e médicos, gestores de farmácia, balconistas e caixas no aplicativo desktop."),
    P("O objetivo desta documentação é representar o estado real do projeto. Por isso, conceitos planejados mas sem implementação foram retirados do conjunto de requisitos concluídos ou movidos para a seção de lacunas e trabalhos futuros."),
    heading("1.1 Objetivo geral", 2),
    P("Oferecer um protótipo integrado para cadastro e autenticação de usuários, acompanhamento clínico remoto e operação farmacêutica, compartilhando dados por meio de uma API REST e de um banco MySQL."),
    heading("1.2 Objetivos específicos comprovados no código", 2),
]
story += bullets([
    "Cadastrar e autenticar pacientes e médicos, mantendo sessões por token JWT.",
    "Permitir ao paciente consultar e agendar teleconsultas, visualizar receitas, prontuários e documentos de exame.",
    "Permitir ao médico consultar pacientes e agenda, registrar prontuários e emitir receitas.",
    "Apoiar farmácias no cadastro de produtos, lotes, cupons, funcionários, clientes e vendas.",
    "Gerar indicadores e relatórios operacionais no cliente desktop.",
    "Disponibilizar interfaces web, móvel e desktop ligadas ao mesmo domínio de negócio.",
])

# Metodologia de auditoria
story += [
    heading("2. Metodologia da revisão", 1),
    P("A revisão percorreu os arquivos-fonte e manifestos dos quatro módulos, incluindo controladores, modelos, repositórios, serviços, telas, configurações, dependências e testes. Arquivos gerados pelas plataformas, imagens e PDFs temporários foram inventariados, mas não foram tratados como prova de funcionalidade."),
    P("Cada recurso foi classificado como: <b>Implementado</b>, quando há fluxo e persistência/integração coerentes no código; <b>Parcial ou demonstrativo</b>, quando há interface ou parte do fluxo, mas falta integração essencial; e <b>Não implementado</b>, quando não foi encontrado código correspondente."),
    heading("2.1 Escopo inspecionado", 2),
    table(
        ["Módulo", "Tecnologia", "Papel observado"],
        [
            ["projetoIntegradorApi", "Java 17, Spring Boot 4.0.5, Spring MVC, JPA, Security, MySQL", "API REST, autenticação, regras e persistência principal"],
            ["FarmaGrid+_MOBILE", "Flutter/Dart 3.10, HTTP, Secure Storage, Image Picker", "Aplicativo para pacientes e médicos"],
            ["PI_web/farmagrid", "React 18, Vite 7", "Landing page, cadastro/login e painel do paciente"],
            ["Desktop/Electron", "Electron 38, HTML/CSS/JS, MySQL2, PDFKit, XLSX, Google GenAI", "Operação médica e farmacêutica, caixa e relatórios"],
        ],
        widths=[3.5 * cm, 5.7 * cm, 7.1 * cm],
    ),
]

# Arquitetura
story += [
    heading("3. Arquitetura atual", 1),
    P("A arquitetura é composta por três clientes e uma API central. O aplicativo Flutter e o portal React apontam, por padrão, para <i>https://farmagrid.onrender.com</i>. O Electron também utiliza essa API, mas mantém fluxos que acessam o MySQL diretamente. Essa característica torna o desktop uma aplicação híbrida e aumenta o acoplamento ao esquema do banco."),
    table(
        ["Origem", "Comunicação", "Destino"],
        [
            ["Flutter", "HTTPS/JSON com Bearer JWT", "API Spring Boot"],
            ["React", "HTTPS/JSON com Bearer JWT; localStorage para token e dados demonstrativos", "API Spring Boot e armazenamento local"],
            ["Electron", "IPC entre renderer e processo principal", "Handlers do main.js"],
            ["Electron main", "HTTPS/JSON e consultas SQL diretas", "API Spring Boot e MySQL"],
            ["API", "JPA/Hibernate", "MySQL"],
            ["Serviços externos", "HTTP/SDK", "Google Places, Google Meet por link e Gemini quando configurado"],
        ],
        widths=[3.5 * cm, 6.1 * cm, 6.7 * cm],
    ),
    heading("3.1 Backend e persistência", 2),
    P("A API adota controladores REST, 26 repositórios Spring Data e entidades JPA. O acesso às rotas <i>/api/**</i> exige token. Login e cadastro de paciente/médico são públicos. As senhas de login são verificadas e gravadas com BCrypt. O Hibernate está configurado por propriedades externas para conexão com MySQL."),
    heading("3.2 Segurança observada", 2),
]
story += bullets([
    "JWT HMAC-SHA256 com validade de oito horas; token transportado no cabeçalho Authorization.",
    "Sessão móvel armazenada com flutter_secure_storage; portal web mantém token no localStorage.",
    "CORS e CSRF estão configurados para o modelo stateless da API.",
    "Limitação crítica: a chave de assinatura JWT está fixa no código-fonte e deve ser migrada para variável de ambiente.",
    "Limitação: a configuração exige autenticação para /api/**, mas não restringe controladores por papel; um token autenticado pode alcançar rotas de outros perfis se souber os identificadores.",
    "Limitação: o Electron executa consultas SQL diretas em vários fluxos, contornando parte das regras e controles da API.",
    "Não há evidência de trilha de auditoria abrangente, criptografia de dados clínicos em repouso, revogação de token, MFA ou gestão formal de consentimento LGPD.",
])

# Matriz funcional
story += [
    heading("4. Matriz consolidada de funcionalidades", 1),
    table(
        ["Funcionalidade", "Status", "Evidência e limite"],
        [
            ["Cadastro de paciente", "Implementado", "Web e mobile chamam POST /auth/cadastro/paciente; API persiste paciente e login."],
            ["Cadastro de médico", "Implementado", "Web e mobile chamam POST /auth/cadastro/medico; dados profissionais básicos persistidos."],
            ["Cadastro de farmácia", "Demonstrativo", "No portal web é salvo apenas no localStorage; não há endpoint público equivalente na API."],
            ["Login e sessão", "Implementado", "JWT, BCrypt, restauração de sessão no mobile e token no portal/desktop."],
            ["Perfis e fotos", "Implementado", "Consulta/edição de paciente e médico, foto em base64 e alteração de senha."],
            ["Agenda e teleconsulta", "Parcial", "Agendamento, listagem e reagendamento existem; a sala é um link externo, sem vídeo próprio."],
            ["Prontuário", "Implementado", "Listagem por paciente e inclusão/edição pelo médico; desktop também usa SQL direto."],
            ["Receita digital", "Implementado", "Criação e consulta de prescrições com medicamento, dose, frequência, duração e instruções."],
            ["Assinatura/plano", "Parcial", "Status e dados de assinatura são gravados, mas não há cobrança nem gateway de pagamento."],
            ["Exames/documentos", "Parcial", "Solicitação e armazenamento/consulta de relatório existem; não há laboratório integrado."],
            ["Farmácias próximas", "Implementado com dependência", "Consulta Google Places usando endereço/coordenadas do paciente e chave externa."],
            ["Cupons e descontos", "Implementado", "CRUD no desktop/API, listagem pública autenticada e resgate pelo paciente."],
            ["Loja do paciente", "Demonstrativo", "Portal usa catálogo mock e checkout local; mobile pode cair em dados fallback."],
            ["Estoque", "Implementado", "CRUD de produtos, lotes, quantidade, estoque mínimo e prateleira."],
            ["Validade", "Implementado", "Tela desktop calcula alertas a partir da validade dos lotes e permite remover/resolver lote."],
            ["Funcionários", "Implementado", "Cadastro, edição, listagem e ativação/inativação vinculados à farmácia."],
            ["Clientes da farmácia", "Implementado", "Cadastro e consulta por CPF com vínculo à farmácia."],
            ["Caixa e vendas", "Implementado", "Carrinho/total/formas de pagamento/troco e persistência de venda; não processa pagamento externo."],
            ["Relatórios", "Implementado no desktop", "Geração e histórico de relatórios de estoque, validade e vendas em PDF/XLSX."],
            ["Parcerias médicas", "Implementado no desktop", "Cadastro, serviços, desconto, status e encaminhamento de paciente; parte usa SQL direto."],
            ["Assistente de IA", "Parcial", "Tela Electron chama Google Gemini quando GEMINI_API_KEY está configurada; não é motor clínico validado."],
            ["Notificações", "Não implementado", "Há opções visuais de preferência, mas não existe serviço de envio, fila ou persistência funcional completa."],
            ["Sensor IoT", "Não implementado", "Não há firmware, protocolo, leitura de sensor ou endpoint de telemetria; a tela sensor.html exibe cupons."],
            ["Suporte/Help Center", "Não implementado", "Não há entidade, tela ou endpoint de tickets."],
            ["Auditoria e LGPD", "Parcial", "Há aceite visual de termos em cadastros, sem registro versionado de consentimento ou trilha abrangente."],
        ],
        widths=[4.0 * cm, 2.8 * cm, 9.5 * cm],
        status_col=1,
    ),
]

# Módulos
story += [
    PageBreak(),
    heading("5. Aplicativo móvel Flutter", 1),
    P("O aplicativo usa a mesma base para os perfis paciente e médico. Após login, o tipo retornado pela API define o fluxo. A sessão é restaurada do armazenamento seguro e as chamadas incluem o token JWT."),
    heading("5.1 Fluxo do paciente", 2),
]
story += bullets([
    "Dashboard com dados de perfil e indicadores carregados da API.",
    "Listagem de teleconsultas e agendamento por médico, data e horário.",
    "Consulta de receitas e prontuários; botões de visualização/baixar PDF existem na interface, mas nem todo fluxo de download possui integração completa.",
    "Tela de exames com relatórios existentes e solicitação de novo exame.",
    "Cupons disponíveis e resgate vinculado ao paciente.",
    "Farmácias próximas por integração Google Places, condicionada a endereço válido e chave configurada.",
    "Configuração de perfil, foto, senha, dependentes, cartões e assinatura/plano.",
    "Loja de medicamentos: tenta consumir produtos, porém o endpoint exige idFarmacia; a tela mantém fallback local e não conclui uma compra real.",
])
story += [heading("5.2 Fluxo do médico", 2)]
story += bullets([
    "Painel com contagem de pacientes, consultas e receitas.",
    "Agenda/listagem de teleconsultas.",
    "Listagem de pacientes relacionados ao médico e consulta de detalhes.",
    "Criação e edição de prontuários.",
    "Emissão de receitas com múltiplos campos clínicos.",
    "Relatórios/resumo de atividade.",
    "Configuração de dados pessoais, dados profissionais, preferências, foto e senha.",
    "Telas de parcerias e insights de IA existem no mobile, mas apresentam conteúdo predominantemente estático; a integração de IA efetiva está no Electron.",
])
story += [
    heading("5.3 Qualidade do módulo móvel", 2),
    P("Foram executados dois testes de widget: abertura na tela de login e estado de carregamento durante restauração de sessão. Ambos passaram. O comando <i>flutter analyze</i> concluiu com 129 apontamentos, entre avisos e informações: código não usado, nomes fora do padrão, APIs depreciadas, uso de contexto após operações assíncronas e outros itens de manutenção. Não foram observados testes de integração com a API."),
]

story += [
    heading("6. Portal web React", 1),
    P("O portal contém landing page responsiva, apresentação de serviços e planos, tela de login/cadastro, confirmação de cadastro, edição de perfil e painel do paciente. O build de produção foi validado com Vite."),
    heading("6.1 Recursos integrados", 2),
]
story += bullets([
    "Login de paciente/profissional pela API e armazenamento do token.",
    "Cadastro de paciente e médico pela API.",
    "Consulta de teleconsultas e receitas do paciente, enriquecendo consultas com dados dos médicos.",
    "Agendamento de teleconsulta e abertura do link de sala quando informado.",
    "Atualização de perfil e foto do paciente, com fallback local em caso de falha no servidor.",
    "Layout do painel, consultas, receitas, loja e carrinho.",
])
story += [
    heading("6.2 Limites do portal", 2),
    P("O painel implementado é do paciente. Embora o login aceite outros perfis, médico, farmácia, balconista e caixa não recebem painéis web próprios. O cadastro de farmácia é uma demonstração em localStorage. A loja usa catálogo mock e a finalização do carrinho apenas exibe uma confirmação local, pois produtos e vendas exigem vínculo com uma farmácia que o paciente não possui no esquema atual."),
]

story += [
    heading("7. Aplicação desktop Electron", 1),
    P("O desktop reúne a maior parte dos fluxos de operação farmacêutica e também telas para médicos. A navegação é feita por arquivos HTML carregados na janela Electron; o preload expõe funções controladas ao renderer e o processo principal executa chamadas HTTP, consultas MySQL, criação de arquivos e integração de IA."),
    heading("7.1 Perfil médico", 2),
]
story += bullets([
    "Dashboard e acesso a prontuários, receitas e teleconsultas.",
    "Agenda de consultas com criação e reagendamento; entrada em Google Meet por link externo.",
    "Cadastro e consulta de prontuários e receitas, inclusive fluxo de receita controlada mantido diretamente no desktop/banco.",
    "Parcerias com cadastro, status, desconto, serviços e encaminhamento de pacientes.",
    "Configurações pessoais/profissionais, preferências e foto.",
    "Assistente com Gemini condicionado à variável GEMINI_API_KEY.",
])
story += [heading("7.2 Gestão de farmácia", 2)]
story += bullets([
    "Dashboard com indicadores operacionais.",
    "Produtos e lotes: cadastro, edição, exclusão, quantidade, estoque mínimo, código de barras e prateleira.",
    "Validade: classificação de lotes por dias restantes e tratamento/remoção de itens.",
    "Cupons: cadastro, edição, exclusão, status, validade, limite e uso.",
    "Funcionários: cadastro, edição, consulta e status.",
    "Relatórios de estoque, validade e vendas, com histórico e download.",
])
story += [heading("7.3 Balconista e caixa", 2)]
story += bullets([
    "Cadastro e busca de cliente por CPF, vinculado à farmácia.",
    "Montagem de venda, cálculo de total e troco, seleção de forma de pagamento e persistência da venda.",
    "Consulta de vendas com filtros de data.",
    "Não existe integração com adquirente, PIX, emissão fiscal ou confirmação bancária; as formas de pagamento são registros informativos.",
])
story += [
    heading("7.4 Pontos técnicos do desktop", 2),
    P("Os arquivos JavaScript principais passaram em verificação de sintaxe com Node. O módulo não possui testes automatizados. O package.json declara o script de teste padrão como não implementado. Parte significativa das regras está concentrada em <i>main.js</i>, arquivo extenso que mistura IPC, SQL, API, arquivos e IA; a separação em serviços menores é recomendada."),
]

# API
story += [
    heading("8. API REST", 1),
    P("A API centraliza recursos de autenticação, cadastros, saúde e farmácia. A tabela abaixo agrupa as rotas observadas; todas as rotas /api exigem Bearer JWT pela configuração atual."),
    table(
        ["Grupo", "Operações disponíveis"],
        [
            ["Autenticação", "POST /auth/login; POST /auth/cadastro/paciente; POST /auth/cadastro/medico"],
            ["Paciente/perfil", "CRUD de pacientes; GET/PUT config; PUT foto; assinatura; busca por nome"],
            ["Médico/perfil", "Listagem e consulta; painel; pacientes vinculados; config; dados pessoais/profissionais; preferências; foto"],
            ["Teleconsultas", "Listagem geral/por médico/por paciente; criação; atualização; reagendamento"],
            ["Prontuários", "Listagem, consulta, criação, edição e consulta por paciente"],
            ["Receitas", "Consulta por id, por médico e por paciente; criação"],
            ["Exames/relatórios", "Solicitação de exame; listagem por paciente; upload multipart, download de arquivo e exclusão"],
            ["Farmácias próximas", "Consulta baseada no paciente por meio de Google Places"],
            ["Produtos/lotes", "CRUD de produtos; estoque baixo; listagem/criação/remoção de lotes; alteração de prateleira"],
            ["Cupons", "CRUD por farmácia; disponíveis; listagem e resgate por paciente"],
            ["Funcionários", "Cadastro, consulta, edição, listagem por farmácia e mudança de status"],
            ["Clientes/vendas", "Cadastro/consulta de cliente; listagem e criação de vendas por farmácia"],
            ["Dependentes/alergias/cartões", "CRUDs básicos e consultas vinculadas ao paciente"],
            ["Disponibilidade médica", "Criação, edição, remoção e consulta por médico"],
            ["Parcerias", "Listagem e criação pela API; operações adicionais permanecem no desktop/SQL"],
            ["Relatórios de farmácia", "Consulta, criação e listagem por farmácia"],
        ],
        widths=[4.1 * cm, 12.2 * cm],
    ),
    heading("8.1 Entidades de domínio", 2),
    P("Foram identificadas entidades para Login, Paciente, Médico, Médico-Clínica, Teleconsulta, Consulta, Disponibilidade Médica, Prontuário, Receita, Solicitação de Exame, Relatório, Produto, Lote, Cupom, Resgate de Cupom, Funcionário, Cliente, vínculo Cliente-Farmácia, Venda, Parceiro, Relatório de Farmácia, Dependente, Alergia, vínculo Paciente-Alergia, Cartão e estruturas auxiliares."),
    heading("8.2 Observações de modelagem", 2),
]
story += bullets([
    "Existem modelos paralelos para Consulta e Teleconsulta; consolidá-los reduziria duplicidade.",
    "O paciente não possui vínculo explícito com farmácia, o que impede determinar a origem de produtos/vendas na loja do paciente.",
    "Venda armazena os produtos como JSON textual, reduzindo consultas relacionais e integridade referencial.",
    "O desktop referencia tabelas adicionais para receitas controladas, serviços e encaminhamentos de parceiros que não aparecem como entidades JPA completas.",
    "Não há migrações versionadas de banco no repositório; o ambiente depende do esquema já existente e do ddl-auto configurado.",
])

# requisitos atualizados
story += [
    heading("9. Requisitos funcionais atualizados", 1),
    P("Os requisitos abaixo substituem a lista genérica do documento anterior e refletem o estado observável do projeto."),
    table(
        ["ID", "Requisito", "Situação"],
        [
            ["RF01", "Cadastrar pacientes e médicos com validação básica e senha protegida.", "Atendido"],
            ["RF02", "Autenticar usuários por e-mail, senha e tipo, emitindo token JWT.", "Atendido"],
            ["RF03", "Consultar e atualizar perfis, fotos e senhas de paciente/médico.", "Atendido"],
            ["RF04", "Listar, criar e reagendar teleconsultas.", "Atendido"],
            ["RF05", "Abrir sala externa associada à consulta quando houver link.", "Parcial"],
            ["RF06", "Registrar, editar e consultar prontuários por paciente.", "Atendido"],
            ["RF07", "Emitir e consultar receitas digitais estruturadas.", "Atendido"],
            ["RF08", "Solicitar exames e armazenar/consultar relatórios anexos.", "Parcial"],
            ["RF09", "Gerenciar dependentes, alergias e cartões do paciente.", "Atendido no mobile/API"],
            ["RF10", "Localizar farmácias próximas por serviço de mapas.", "Condicionado"],
            ["RF11", "Gerenciar assinatura do paciente.", "Parcial, sem pagamento"],
            ["RF12", "Gerenciar produtos e lotes por farmácia.", "Atendido"],
            ["RF13", "Identificar estoque baixo e vencimentos.", "Atendido"],
            ["RF14", "Gerenciar cupons e permitir resgate pelo paciente.", "Atendido"],
            ["RF15", "Gerenciar funcionários e seus status.", "Atendido"],
            ["RF16", "Cadastrar clientes da farmácia.", "Atendido"],
            ["RF17", "Registrar vendas e formas de pagamento.", "Atendido sem gateway/fiscal"],
            ["RF18", "Gerar e consultar relatórios operacionais.", "Atendido no desktop"],
            ["RF19", "Gerenciar parcerias e encaminhamentos médicos.", "Atendido no desktop"],
            ["RF20", "Consultar assistente de IA quando credencial externa estiver configurada.", "Parcial/experimental"],
        ],
        widths=[1.4 * cm, 11.1 * cm, 3.8 * cm],
    ),
]

story += [
    heading("10. Requisitos não funcionais e realidade atual", 1),
    table(
        ["Tema", "Situação observada", "Ação recomendada"],
        [
            ["Portabilidade", "Flutter contém alvos Android, iOS, web, Windows, Linux e macOS; portal é web; Electron é desktop.", "Homologar somente plataformas efetivamente testadas."],
            ["Segurança", "JWT e BCrypt existem, mas segredo fixo e ausência de autorização por perfil são riscos.", "Externalizar segredo, aplicar RBAC, validar ownership e revisar logs."],
            ["Privacidade", "Dados clínicos e pessoais são tratados, sem governança LGPD completa.", "Consentimento versionado, minimização, retenção, auditoria e política de exclusão."],
            ["Confiabilidade", "Há tratamentos de erro e fallbacks, mas poucos testes automatizados.", "Adicionar testes unitários, integração com banco isolado e testes ponta a ponta."],
            ["Desempenho", "Não há teste de carga nem meta mensurável.", "Definir SLOs e executar teste de carga da API/banco."],
            ["Usabilidade", "Interfaces possuem feedback visual e responsividade parcial.", "Executar testes com usuários e auditoria de acessibilidade."],
            ["Acessibilidade", "Não há evidência de conformidade WCAG/semântica completa.", "Revisar contraste, foco, teclado, leitores de tela e textos alternativos."],
            ["Observabilidade", "Uso predominante de console/logs; sem métricas ou rastreamento central.", "Adicionar logs estruturados, health checks, métricas e alertas."],
            ["Manutenibilidade", "Desktop concentra responsabilidades; mobile possui 129 apontamentos estáticos.", "Refatorar serviços, resolver warnings e padronizar nomes."],
        ],
        widths=[2.8 * cm, 7.0 * cm, 6.5 * cm],
    ),
]

# Removidos/ausentes
story += [
    heading("11. Itens retirados da descrição de funcionalidades concluídas", 1),
    P("Os itens a seguir constavam ou eram sugeridos no documento anterior, mas não podem ser descritos como entregues no estado atual:"),
]
story += bullets([
    "Sensor inteligente/IoT para leitura automática de estoque, bateria, pareamento ou telemetria.",
    "Pagamento real de consulta, assinatura ou compra por gateway; emissão de PIX, autorização de cartão e faturamento financeiro.",
    "Videoconferência nativa com áudio/vídeo; o sistema apenas abre URL de sala/Google Meet.",
    "Serviço de notificações por push, e-mail ou SMS; as preferências visuais não equivalem ao envio.",
    "Help Center e gestão de tickets.",
    "Painel web completo para médico, clínica, farmácia, balconista e caixa.",
    "Cadastro persistido de clínica e farmácia pelo fluxo público web.",
    "Validação farmacêutica formal de receita digital, assinatura ICP-Brasil ou QR verificável.",
    "Integração com laboratório, prontuário nacional, sistema fiscal, adquirente ou operadora de plano.",
    "Auditoria regulatória completa e comprovação de conformidade LGPD.",
])

# Validação
story += [
    heading("12. Validação executada nesta revisão", 1),
    table(
        ["Verificação", "Resultado", "Observação"],
        [
            ["Portal: npm run build", "Aprovado", "Vite transformou 50 módulos e gerou dist."],
            ["Mobile: flutter test", "Aprovado", "2 testes de widget aprovados."],
            ["Mobile: flutter analyze", "Com apontamentos", "129 avisos/informações; sem erro impeditivo de teste."],
            ["API: compilação Maven", "Aprovada", "88 arquivos Java compilados."],
            ["API: mvnw test", "Bloqueado pelo ambiente", "O único teste de contexto requer DB_URL e credenciais MySQL; não há banco de teste isolado."],
            ["Electron: node --check", "Aprovado", "main.js, preload.js, client.js e conexao.js sem erro de sintaxe."],
            ["Electron: testes automatizados", "Ausentes", "Script npm test declara que não há teste especificado."],
        ],
        widths=[4.5 * cm, 3.1 * cm, 8.7 * cm],
    ),
    P("Os resultados acima verificam compilação, análise estática e testes existentes, mas não comprovam operação ponta a ponta com banco, serviços externos e credenciais de produção."),
]

# Instalação
story += [
    heading("13. Configuração e execução", 1),
    heading("13.1 API", 2),
]
story += bullets([
    "Pré-requisitos: JDK 17 ou superior compatível, MySQL e acesso às dependências Maven.",
    "Configurar DB_URL, DB_USERNAME e DB_PASSWORD conforme application.properties; configurar chave do Google Places se o recurso for usado.",
    "Executar no diretório projetoIntegradorApi com mvnw.cmd spring-boot:run no Windows ou ./mvnw spring-boot:run em Unix.",
    "A API usa a porta configurada pelo ambiente e exige um esquema compatível com as entidades e consultas do desktop.",
])
story += [heading("13.2 Aplicativo móvel", 2)]
story += bullets([
    "Instalar Flutter compatível com SDK Dart ^3.10.1.",
    "Executar flutter pub get e flutter run no diretório FarmaGrid+_MOBILE.",
    "A URL padrão da API está em lib/config/api_config.dart e aponta para o serviço hospedado.",
])
story += [heading("13.3 Portal web", 2)]
story += bullets([
    "Usar Node.js/npm, executar npm ci e npm run dev em PI_web/farmagrid.",
    "VITE_API_URL pode substituir a URL padrão da API.",
    "npm run build gera os artefatos de produção em dist.",
])
story += [heading("13.4 Desktop", 2)]
story += bullets([
    "Executar npm ci e npm start em Desktop/Electron.",
    "Configurar API_BASE_URL para trocar a API; configurar credenciais MySQL usadas por src/db/conexao.js.",
    "Configurar GEMINI_API_KEY somente se o assistente de IA for utilizado.",
    "Algumas telas dependem simultaneamente da API e do acesso direto ao banco.",
])

# Riscos e roadmap
story += [
    heading("14. Riscos, pendências e prioridades", 1),
    table(
        ["Prioridade", "Pendência", "Impacto"],
        [
            ["Crítica", "Remover segredo JWT do código, rotacioná-lo e usar variável segura.", "Tokens podem ser forjados se o repositório for exposto."],
            ["Crítica", "Implementar autorização por perfil e propriedade do recurso.", "A autenticação isolada não impede acesso indevido entre usuários."],
            ["Alta", "Eliminar acesso MySQL direto no Electron e mover regras para a API.", "Aumenta segurança, consistência e capacidade de auditoria."],
            ["Alta", "Criar migrações de banco e ambiente de teste isolado.", "Reprodutibilidade e testes hoje dependem de infraestrutura externa."],
            ["Alta", "Definir vínculo paciente-farmácia para a loja e vendas.", "Checkout web/mobile permanece simulado ou inconsistente."],
            ["Alta", "Formalizar proteção de dados de saúde e consentimento LGPD.", "Dados sensíveis exigem controles além do protótipo atual."],
            ["Média", "Consolidar Consulta e Teleconsulta e normalizar itens de venda.", "Reduz duplicidade e inconsistência de dados."],
            ["Média", "Aumentar testes e corrigir apontamentos do Flutter.", "Melhora estabilidade e manutenção."],
            ["Média", "Marcar telas demonstrativas de forma explícita na interface.", "Evita confundir protótipo com serviço real."],
            ["Baixa", "Implementar IoT, notificações e help center apenas após definição de escopo.", "Esses recursos não existem e exigem arquitetura própria."],
        ],
        widths=[2.2 * cm, 8.1 * cm, 6.0 * cm],
    ),
]

# Conclusão
story += [
    heading("15. Conclusão", 1),
    P("O FarmaGrid+ possui uma base funcional ampla e coerente com um projeto integrador: autenticação, três interfaces, domínio clínico, gestão farmacêutica, caixa, relatórios e integrações externas. A API compila, o portal gera build e os testes móveis existentes passam. A documentação anterior, contudo, apresentava como concluídos recursos que não estão no repositório ou estão apenas parcialmente integrados."),
    P("Com esta revisão, o projeto passa a ser descrito de forma aderente ao código: teleconsulta significa agendamento mais abertura de link externo; pagamentos são registros sem gateway; IoT e suporte não foram implementados; notificações são apenas opções visuais; e loja/cadastro de farmácia no web contêm simulações. Essa distinção preserva os méritos do protótipo e oferece uma base objetiva para a evolução técnica."),
    P("Para avançar em direção a um ambiente de produção, as primeiras ações devem ser segurança de JWT e autorização, centralização do acesso a dados na API, migrações e testes isolados, modelagem do vínculo paciente-farmácia e governança de dados sensíveis."),
]

# Apêndice
story += [
    PageBreak(),
    heading("Apêndice A — Inventário resumido de arquivos e evidências", 1),
    table(
        ["Área", "Arquivos/diretórios de referência"],
        [
            ["API", "pom.xml; controller/; model/; repository/; service/; security/; config/; application.properties"],
            ["Mobile", "pubspec.yaml; lib/main.dart; lib/services/; lib/models/; lib/telas/telasPaciente/; lib/telas/telasMedico/"],
            ["Web", "package.json; src/App.jsx; src/pages/; src/dashboards/; src/services/; src/hooks/; src/data/"],
            ["Desktop", "package.json; main.js; preload.js; src/api/client.js; src/db/conexao.js; src/views/*.html"],
            ["Testes", "projetoIntegradorApi/src/test; FarmaGrid+_MOBILE/test; PI_web/farmagrid/src/utils/maskUtils.test.js"],
        ],
        widths=[3.2 * cm, 13.1 * cm],
    ),
    Spacer(1, 0.5 * cm),
    P("<b>Critério de fechamento:</b> esta documentação registra o repositório observado em 22/09/2026. Funcionalidades adicionadas depois dessa data devem ser novamente confrontadas com código, testes e integrações antes de serem declaradas como concluídas.", "Callout"),
]


doc = FarmaDocTemplate(str(OUTPUT))
doc.multiBuild(story)
print(OUTPUT)
