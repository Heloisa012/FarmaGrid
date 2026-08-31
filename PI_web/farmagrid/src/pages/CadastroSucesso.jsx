import '../styles/login.css';
import '../styles/inicio.css';
import { useEffect } from 'react';
import { Logo } from '../components/Logo.jsx';
import { SuccessAnimation } from '../components/SuccessAnimation.jsx';

export function CadastroSucesso({ onVoltar, titulo, mensagem, redirecionarEm }) {
  const tituloFinal = titulo || 'Login realizado com sucesso';

  useEffect(() => {
    if (!redirecionarEm) return undefined;
    const timer = window.setTimeout(onVoltar, redirecionarEm);
    return () => window.clearTimeout(timer);
  }, [onVoltar, redirecionarEm]);

  return (
    <div className="login-page">
      <div className="login-box login-success-box" style={{ textAlign: 'center' }}>
        <div className="login-logo"><Logo size="lg" /></div>

        <SuccessAnimation title={tituloFinal} />

        <p className="login-sub success-message">
          {mensagem || 'As funções para médicos, clínicas e farmácias ficam disponíveis nos aplicativos FarmaGrid. Baixe o app para continuar o seu cadastro.'}
        </p>

        <div className="download-btns" style={{ justifyContent: 'center', margin: '28px 0 8px' }}>
          <button type="button" className="btn-download">
            <img src="/midia/download3.png" alt="Windows" className="img-download" />
            <span>Baixar para PC</span>
          </button>
          <button type="button" className="btn-download">
            <img src="/midia/download3.png" alt="Mobile" className="img-download" />
            <span>Baixar para Celular</span>
          </button>
        </div>

        <span className="back-link" onClick={onVoltar} style={{ display: 'inline-block', marginTop: 16 }}>
          ← Voltar para home
        </span>
      </div>
    </div>
  );
}
