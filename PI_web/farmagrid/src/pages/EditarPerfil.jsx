import { useState, useEffect } from 'react';

export function EditarPerfil({ dados, onSalvar, onCancelar }) {
  const [form, setForm] = useState(dados);
  const [preview, setPreview] = useState(dados.avatar);

  useEffect(() => {
    setForm(dados);
    setPreview(dados.avatar);
  }, [dados]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setForm((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSalvar(form);
  };

  const initials = form.nome
    ? form.nome.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()
    : 'US';

  return (
    <div className="profile-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Perfil</p>
          <h2>Editar informações</h2>
          <p>Atualize seus dados pessoais e a foto do perfil.</p>
        </div>
      </div>

      <div className="profile-grid">
        <section className="profile-summary card">
          <div className="profile-avatar-box">
            {preview ? (
              <img src={preview} alt="Avatar" className="profile-avatar" />
            ) : (
              <div className="avatar-fallback">{initials}</div>
            )}
          </div>
          <div className="profile-summary-content">
            <h3>{form.nome}</h3>
            <p className="profile-role">{form.cargo}</p>
            <p className="profile-bio">{form.bio}</p>
          </div>
          <div className="profile-info-row">
            <strong>Email</strong>
            <span>{form.email}</span>
          </div>
          <div className="profile-info-row">
            <strong>Telefone</strong>
            <span>{form.telefone}</span>
          </div>
          <div className="profile-info-row">
            <strong>Empresa</strong>
            <span>{form.empresa}</span>
          </div>
          <label className="file-upload">
            Alterar foto
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
        </section>

        <section className="profile-form card">
          <form onSubmit={handleSubmit} className="profile-edit-form">
            <div className="form-group">
              <label>Nome completo</label>
              <input name="nome" value={form.nome} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Telefone</label>
                <input name="telefone" value={form.telefone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Função</label>
                <input name="cargo" value={form.cargo} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Empresa</label>
              <input name="empresa" value={form.empresa} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea name="bio" rows="5" value={form.bio} onChange={handleChange} />
            </div>
            <div className="profile-actions">
              <button type="button" className="btn btn-secondary" onClick={onCancelar}>Cancelar</button>
              <button type="submit" className="btn btn-primary">Salvar alterações</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
