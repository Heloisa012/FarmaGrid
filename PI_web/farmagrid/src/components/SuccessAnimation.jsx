import '../styles/success-animation.css';

export function SuccessAnimation({ title = 'Login realizado com sucesso', subtitle = '', className = '' }) {
  return (
    <div className={`success-animation-wrapper ${className}`.trim()}>
      <div className="success-animation" aria-label="Sucesso" role="img">
        <svg className="success-animation-svg" viewBox="0 0 120 120" aria-hidden="true">
          <circle className="success-ring" cx="60" cy="60" r="42" />
          <path className="success-check" d="M38 62 L52 76 L84 44" />
        </svg>
      </div>

      {title && <h2 className="success-animation-title">{title}</h2>}
      {subtitle && <p className="success-animation-subtitle">{subtitle}</p>}
    </div>
  );
}
