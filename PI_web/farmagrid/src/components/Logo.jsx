export function Logo({ onClick, size = 'md' }) {
  const fontSize = size === 'lg' ? '2rem' : size === 'sm' ? '1.25rem' : '1.5rem';
  const imgH = size === 'lg' ? 50 : size === 'sm' ? 40 : 45;

  return (
    <div className="logo" style={{ fontSize }} onClick={onClick}>
      <img src="/midia/logo.png" alt="FarmaGrid Logo" className="logo-image" style={{ height: imgH }} />
      <span>FarmaGrid</span>
    </div>
  );
}
