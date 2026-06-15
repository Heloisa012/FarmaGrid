// ── Status Badge ──────────────────────────────────────────────────────────────
const STATUS_MAP = {
  Confirmada: 'sb-green', Pendente: 'sb-amber', Aguardando: 'sb-amber', Agendada: 'sb-blue',
  OK: 'sb-green', Baixo: 'sb-amber', Crítico: 'sb-red',
  Separando: 'sb-blue', Entregue: 'sb-green',
  Ativo: 'sb-green', Ativa: 'sb-green', Disponível: 'sb-green',
};

export function SBadge({ s }) {
  return <span className={`sbadge ${STATUS_MAP[s] || 'sb-gray'}`}>{s}</span>;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
export function StatCard({ label, IcoComp, value, sub, subCls }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        <div className="stat-card-icon"><IcoComp /></div>
      </div>
      <div className="stat-card-val">{value}</div>
      {sub && <div className={`stat-card-sub ${subCls || ''}`}>{sub}</div>}
    </div>
  );
}

// ── Page Header ───────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="page-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
export function Modal({ open, title, onClose, children, footer, wide }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-box ${wide ? 'modal-wide' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
export function Toast({ message }) {
  if (!message) return null;
  return <div className="toast">{message}</div>;
}
