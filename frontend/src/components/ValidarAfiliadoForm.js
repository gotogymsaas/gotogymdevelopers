import React, { useState } from 'react';

export default function ValidarAfiliadoForm({ onValidate, loading }) {
  const [document, setDocument] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [touched, setTouched] = useState({ document: false, birthdate: false });

  // Validaciones simples
  const isDocumentValid = document.trim().length >= 6;
  const isBirthdateValid = /^\d{4}-\d{2}-\d{2}$/.test(birthdate);
  const isFormValid = isDocumentValid && isBirthdateValid;

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      onValidate({ document, birthdate });
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Validar afiliado" className="afiliado-form">
      <div>
        <label htmlFor="document">Documento</label>
        <input
          id="document"
          name="document"
          type="text"
          value={document}
          onChange={e => setDocument(e.target.value)}
          onBlur={handleBlur}
          aria-invalid={!isDocumentValid && touched.document}
          aria-describedby="document-error"
          required
        />
        {!isDocumentValid && touched.document && (
          <span id="document-error" className="error">Debe tener al menos 6 caracteres.</span>
        )}
      </div>
      <div>
        <label htmlFor="birthdate">Fecha de nacimiento</label>
        <input
          id="birthdate"
          name="birthdate"
          type="date"
          value={birthdate}
          onChange={e => setBirthdate(e.target.value)}
          onBlur={handleBlur}
          aria-invalid={!isBirthdateValid && touched.birthdate}
          aria-describedby="birthdate-error"
          required
        />
        {!isBirthdateValid && touched.birthdate && (
          <span id="birthdate-error" className="error">Formato inválido (YYYY-MM-DD).</span>
        )}
      </div>
      <button type="submit" disabled={!isFormValid || loading} aria-busy={loading}>
        {loading ? 'Validando...' : 'Validar afiliado'}
      </button>
      <style>{`
        .afiliado-form { max-width: 350px; margin: 1rem auto; font-family: sans-serif; }
        .afiliado-form label { display: block; margin-bottom: 0.2rem; }
        .afiliado-form input { width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border-radius: 4px; border: 1px solid #ccc; }
        .afiliado-form .error { color: #dc3545; font-size: 0.9em; }
        .afiliado-form button { padding: 0.5rem 1rem; border-radius: 4px; border: none; background: #007bff; color: #fff; font-weight: bold; }
        .afiliado-form button[disabled] { background: #aaa; }
      `}</style>
    </form>
  );
}
