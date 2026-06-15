import { useState } from 'react';
import '../styles/login.css';
import { Logo } from '../components/Logo.jsx';
import { login, cadastro, montarCadastro, mapearTipoFront, obterUsuarioAtual } from '../services/authService.js';

const TIPOS_USUARIO = [
  ['paciente',     'Paciente'],
  ['profissional', 'Médico/Clínica'],
  ['farmacia',     'Farmácia'],
];

export function Login({ onBack, onLogin }) {
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
    sexo: 'M',
    dataNascimento: '',
    rua: '',
    numCasa: '',
    bairro: '',
    crm: '',
    especialidade: '',
    clinica: '',
  });

  const atualizar = (campo, valor) => setForm(prev => ({ ...prev, [campo]: valor }));

  const entrar = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    try {
      const res = await login(form.email, form.senha);
      const me = await obterUsuarioAtual();
      onLogin(mapearTipoFront(res.tipo), { ...me, nome: me.nome || res.nome, email: me.email || form.email });
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
      const payload = montarCadastro(form, form.tipo);
      const res = await cadastro(payload);
      const me = await obterUsuarioAtual();
      onLogin(mapearTipoFront(res.tipo), { ...me, nome: me.nome || form.nome, email: me.email || form.email });
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
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => atualizar('email', e.target.value)} placeholder="seu@email.com" required /></div>
            <div className="form-group"><label>Senha</label><input type="password" value={form.senha} onChange={e => atualizar('senha', e.target.value)} placeholder="••••••••" required /></div>
            <button className="btn btn-primary form-submit" type="submit" disabled={carregando}>{carregando ? 'Entrando...' : 'Entrar'}</button>
            <div className="forgot"><a>Esqueceu a senha?</a></div>
          </form>
        ) : (
          <form onSubmit={registrar}>
            <div className="form-group"><label>Nome Completo</label><input type="text" value={form.nome} onChange={e => atualizar('nome', e.target.value)} placeholder="João Silva" required /></div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={e => atualizar('email', e.target.value)} placeholder="seu@email.com" required /></div>
            <div className="form-group"><label>Senha</label><input type="password" value={form.senha} onChange={e => atualizar('senha', e.target.value)} placeholder="••••••••" required /></div>
            <div className="form-group">
              <label>Tipo de Usuário</label>
              <select value={form.tipo} onChange={e => atualizar('tipo', e.target.value)} required>
                {TIPOS_USUARIO.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>

            {/* Campos de PACIENTE */}
            {form.tipo === 'paciente' && (
              <>
                <div className="form-group"><label>CPF</label><input type="text" value={form.cpf} onChange={e => atualizar('cpf', e.target.value)} placeholder="000.000.000-00" required /></div>
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
              </>
            )}

            {/* Campos de FARMÁCIA (funcionário) */}
            {form.tipo === 'farmacia' && (
              <div className="form-group"><label>CPF</label><input type="text" value={form.cpf} onChange={e => atualizar('cpf', e.target.value)} placeholder="000.000.000-00" required /></div>
            )}

            {/* Campos de MÉDICO */}
            {form.tipo === 'profissional' && (
              <>
                <div className="form-group"><label>CRM</label><input type="text" value={form.crm} onChange={e => atualizar('crm', e.target.value)} placeholder="12345-SP" required /></div>
                <div className="form-group"><label>Especialidade</label><input type="text" value={form.especialidade} onChange={e => atualizar('especialidade', e.target.value)} placeholder="Cardiologia" /></div>
                <div className="form-group"><label>Clínica</label><input type="text" value={form.clinica} onChange={e => atualizar('clinica', e.target.value)} placeholder="Clínica FarmaGrid" /></div>
              </>
            )}

            <div className="form-group"><label>Telefone</label><input type="text" value={form.telefone} onChange={e => atualizar('telefone', e.target.value)} placeholder="(19) 99999-9999" /></div>
            <button className="btn btn-primary form-submit" type="submit" disabled={carregando}>{carregando ? 'Cadastrando...' : 'Criar Conta'}</button>
            <p className="terms">Ao criar uma conta você concorda com os <a>Termos de Uso</a></p>
          </form>
        )}

        <span className="back-link" onClick={onBack}>← Voltar para home</span>
      </div>
    </div>
  );
}
