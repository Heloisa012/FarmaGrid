import { useState } from 'react';
import '../styles/login.css';
import { Logo } from '../components/Logo.jsx';
import {
  mascararCPF,
  mascararCEP,
  mascararCNPJ,
  mascararTelefone,
} from '../utils/maskUtils.js';
import {
  login, logout, montarCadastro,
  cadastroPaciente, cadastroMedico, cadastroFarmacia, buscarConfigPaciente,
} from '../services/authService.js';

// Tipos de cadastro disponíveis. "Farmácia" fica de fora: não existe
// POST /auth/cadastro/farmacia na API (contas de farmácia só são criadas
// pelo aplicativo desktop antigo).
const TIPOS_CADASTRO = [
  ['paciente',     'Paciente'],
  ['profissional', 'Médico/Clínica'],
  ['farmacia',     'Farmácia'],
];

// Tipos que o formulário de LOGIN oferece — precisa saber de antemão qual
// "tipo" numérico mandar pro /auth/login (a API exige isso para achar a
// linha). Farmácia/balconista/caixa não têm valor confirmado, então não
// aparecem aqui (ver services/authService.js).
const TIPOS_LOGIN = [
  ['paciente',     'Paciente'],
  ['profissional', 'Médico/Clínica'],
];

export function Login({ onBack, onLogin, onCadastroSucesso }) {
  const [aba, setAba] = useState('login');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [form, setForm] = useState({
    email: '',
    senha: '',
    nome: '',
    cpf: '',
    telefone: '',
    tipo: 'paciente',
    tipoLogin: 'paciente',
    sexo: 'M',
    dataNascimento: '',
    rua: '',
    numCasa: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    tipoSanguineo: '',
    contatoEmergenciaNome: '',
    contatoEmergenciaTelefone: '',
    crm: '',
    especialidade: '',
    clinica: '',
    farmaciaNome: '',
    farmaciaCnpj: '',
    farmaciaCep: '',
    farmaciaTelefone: '',
    farmaciaCidade: '',
    farmaciaFoto: '',
  });

  const atualizar = (campo, valor) => setForm(prev => ({ ...prev, [campo]: valor }));

  const atualizarComMascara = (campo, valor, mascara) => {
    atualizar(campo, mascara(valor));
  };

  const lerFoto = (arquivo) => new Promise((resolve, reject) => {
    if (!arquivo) return resolve(null);
    const leitor = new FileReader();
    leitor.onload = () => resolve(leitor.result);
    leitor.onerror = () => reject(new Error('Não foi possível ler a foto selecionada.'));
    leitor.readAsDataURL(arquivo);
  });

  const cadastrarFarmaciaDemo = async () => {
    const cnpj = form.farmaciaCnpj.replace(/\D/g, '');
    const cep = form.farmaciaCep.replace(/\D/g, '');
    const telefone = form.farmaciaTelefone.replace(/\D/g, '');
    const idCidade = Number(form.farmaciaCidade);
    if (!form.farmaciaNome.trim() || cnpj.length !== 14 || cep.length !== 8 || telefone.length < 10 || !Number.isInteger(idCidade) || idCidade <= 0) {
      throw new Error('Informe nome, CNPJ, CEP, telefone e cidade válidos.');
    }
    return cadastroFarmacia({
      nome: form.farmaciaNome.trim(), cnpj, cep, telefone, idCidade, fotoPerfil: form.farmaciaFoto,
      email: form.email.trim(), senha: form.senha,
    });
  };

  const entrar = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    try {
      const res = await login(form.email, form.senha, form.tipoLogin);

      // A API só implementa funções de paciente no web — outros perfis
      // (medico/farmacia/balconista/caixa) não usam o painel web atual.
      if (res.perfil !== 'paciente') {
        logout();
        onCadastroSucesso({
          titulo: 'Login realizado, mas...',
          mensagem: 'As funções para médicos, clínicas e farmácias ficam disponíveis apenas nos aplicativos FarmaGrid.',
        });
        return;
      }

      let config = null;
      try {
        config = await buscarConfigPaciente(res.idPaciente);
      } catch {
        // segue mesmo se a busca do perfil completo falhar
      }

      onLogin('paciente', {
        idPaciente: res.idPaciente,
        idLogin: res.id,
        email: config?.email || res.email || form.email,
        nome: config?.nome || form.email,
        telefone: config?.telefone || '',
        fotoPerfil: config?.fotoPerfil || null,
        configRaw: config,
      });
    } catch (err) {
      setErro(err.message || 'Falha ao entrar.');
    } finally {
      setCarregando(false);
    }
  };

  const registrar = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    try {
      if (form.tipo === 'farmacia') {
        await cadastrarFarmaciaDemo();
        onCadastroSucesso({
          titulo: 'Farmácia cadastrada com sucesso',
          mensagem: 'Cadastro salvo para apresentação do projeto. Você será redirecionado para a página inicial.',
          redirecionarEm: 3500,
        });
        return;
      }

      const payload = montarCadastro(form, form.tipo);
      const res = form.tipo === 'profissional'
        ? await cadastroMedico(payload)
        : await cadastroPaciente(payload);

      // Só pacientes usam o painel web. Médico/Clínica só têm acesso via
      // aplicativo, então aqui só confirmamos o cadastro.
      if (form.tipo !== 'paciente') {
        onCadastroSucesso();
        return;
      }

      onLogin('paciente', {
        idPaciente: res.id,
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
      });
    } catch (err) {
      setErro(err.message || 'Falha ao cadastrar.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo"><Logo size="lg" /></div>
        <p className="login-sub">Entre ou cadastre-se para continuar</p>

        <div className="tab-bar">
          <button type="button" className={`tab-btn ${aba === 'login' ? 'active' : ''}`} onClick={() => setAba('login')}>Entrar</button>
          <button type="button" className={`tab-btn ${aba === 'register' ? 'active' : ''}`} onClick={() => setAba('register')}>Cadastrar</button>
        </div>

        {erro && <p className="login-erro">{erro}</p>}

        {aba === 'login' ? (
          <form onSubmit={entrar}>
            <div className="form-group">
              <label>Tipo de Conta</label>
              <select value={form.tipoLogin} onChange={e => atualizar('tipoLogin', e.target.value)} required>
                {TIPOS_LOGIN.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => atualizar('email', e.target.value)} placeholder="seu@email.com" required /></div>
            <div className="form-group"><label>Senha</label><input type="password" value={form.senha} onChange={e => atualizar('senha', e.target.value)} placeholder="••••••••" required /></div>
            <button className="btn btn-primary form-submit" type="submit" disabled={carregando}>{carregando ? 'Entrando...' : 'Entrar'}</button>
            <div className="forgot"><a>Esqueceu a senha?</a></div>
          </form>
        ) : (
          <form onSubmit={registrar}>
            {form.tipo !== 'farmacia' && (
              <div className="form-group"><label>Nome Completo</label><input type="text" value={form.nome} onChange={e => atualizar('nome', e.target.value)} placeholder="João Silva" required /></div>
            )}
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => atualizar('email', e.target.value)} placeholder="seu@email.com" required /></div>
            <div className="form-group"><label>Senha</label><input type="password" value={form.senha} onChange={e => atualizar('senha', e.target.value)} placeholder="••••••••" required /></div>
            <div className="form-group">
              <label>Tipo de Usuário</label>
              <select value={form.tipo} onChange={e => atualizar('tipo', e.target.value)} required>
                {TIPOS_CADASTRO.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>

            {/* Campos de PACIENTE */}
            {form.tipo === 'paciente' && (
              <>
                <div className="form-group"><label>CPF</label><input type="text" value={form.cpf} onChange={e => atualizarComMascara('cpf', e.target.value, mascararCPF)} placeholder="000.000.000-00" maxLength={14} required /></div>
                <div className="form-group">
                  <label>Sexo</label>
                  <select value={form.sexo} onChange={e => atualizar('sexo', e.target.value)} required>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                  </select>
                </div>
                <div className="form-group"><label>Data de Nascimento</label><input type="date" value={form.dataNascimento} onChange={e => atualizar('dataNascimento', e.target.value)} required /></div>
                <div className="form-group"><label>Rua</label><input type="text" value={form.rua} onChange={e => atualizar('rua', e.target.value)} placeholder="Rua das Flores" required /></div>
                <div className="form-group"><label>Número</label><input type="number" value={form.numCasa} onChange={e => atualizar('numCasa', e.target.value)} placeholder="123" required /></div>
                <div className="form-group"><label>Bairro</label><input type="text" value={form.bairro} onChange={e => atualizar('bairro', e.target.value)} placeholder="Centro" required /></div>
                <div className="form-group"><label>Cidade</label><input type="text" value={form.cidade} onChange={e => atualizar('cidade', e.target.value)} placeholder="Campinas" /></div>
                <div className="form-group"><label>Estado</label><input type="text" value={form.estado} onChange={e => atualizar('estado', e.target.value)} placeholder="SP" maxLength={2} /></div>
                <div className="form-group"><label>CEP</label><input type="text" value={form.cep} onChange={e => atualizarComMascara('cep', e.target.value, mascararCEP)} placeholder="00000-000" maxLength={9} /></div>
              </>
            )}

            {/* Campos de MÉDICO */}
            {form.tipo === 'profissional' && (
              <>
                <div className="form-group"><label>CRM</label><input type="text" value={form.crm} onChange={e => atualizar('crm', e.target.value)} placeholder="12345-SP" required /></div>
                <div className="form-group"><label>Especialidade</label><input type="text" value={form.especialidade} onChange={e => atualizar('especialidade', e.target.value)} placeholder="Cardiologia" /></div>
                <div className="form-group"><label>Clínica</label><input type="text" value={form.clinica} onChange={e => atualizar('clinica', e.target.value)} placeholder="Clínica FarmaGrid" /></div>
              </>
            )}

            {form.tipo === 'farmacia' && (
              <>
                <div className="form-group"><label>Nome da Farmácia</label><input type="text" value={form.farmaciaNome} onChange={e => atualizar('farmaciaNome', e.target.value)} placeholder="FarmaGrid Saúde" required /></div>
                <div className="form-group"><label>CNPJ</label><input type="text" value={form.farmaciaCnpj} onChange={e => atualizarComMascara('farmaciaCnpj', e.target.value, mascararCNPJ)} placeholder="00.000.000/0000-00" inputMode="numeric" maxLength={18} required /></div>
                <div className="form-group"><label>CEP</label><input type="text" value={form.farmaciaCep} onChange={e => atualizarComMascara('farmaciaCep', e.target.value, mascararCEP)} placeholder="00000-000" inputMode="numeric" maxLength={9} required /></div>
                <div className="form-group"><label>Telefone</label><input type="text" value={form.farmaciaTelefone} onChange={e => atualizarComMascara('farmaciaTelefone', e.target.value, mascararTelefone)} placeholder="(19) 99999-9999" inputMode="tel" maxLength={15} required /></div>
                <div className="form-group"><label>Cidade (ID)</label><input type="number" min="1" value={form.farmaciaCidade} onChange={e => atualizar('farmaciaCidade', e.target.value)} placeholder="Ex.: 1" required /></div>
                <div className="form-group"><label>Foto de perfil (opcional)</label><input type="file" accept="image/*" onChange={async e => { try { atualizar('farmaciaFoto', await lerFoto(e.target.files[0])); } catch (err) { setErro(err.message); } }} /></div>
              </>
            )}

            {form.tipo !== 'farmacia' && (
              <div className="form-group"><label>Telefone</label><input type="text" value={form.telefone} onChange={e => atualizarComMascara('telefone', e.target.value, mascararTelefone)} placeholder="(19) 99999-9999" maxLength={15} /></div>
            )}
            <button className="btn btn-primary form-submit" type="submit" disabled={carregando}>{carregando ? 'Cadastrando...' : 'Criar Conta'}</button>
            <p className="terms">Ao criar uma conta você concorda com os <a>Termos de Uso</a></p>
          </form>
        )}

        <span className="back-link" onClick={onBack}>← Voltar para home</span>
      </div>
    </div>
  );
}
