import React from 'react';
import './UserValidationResult.css';

export function useUserValidationState({ loading, error, data }) {
  if (loading) return { status: 'loading' };
  if (error) return { status: 'error', message: error };
  if (data && data.valid) return { status: 'success', user: data };
  if (data && !data.valid) return { status: 'notfound' };
  return { status: 'idle' };
}

export default function UserValidationResult({ loading, error, data }) {
  const state = useUserValidationState({ loading, error, data });

  return (
    <div className="user-validation-result">
      {state.status === 'idle' && <span>Ingrese los datos para validar un usuario.</span>}
      {state.status === 'loading' && <span className="loading">Validando usuario...</span>}
      {state.status === 'error' && <span className="error">Error: {state.message}</span>}
      {state.status === 'notfound' && <span className="notfound">Usuario no encontrado o datos inválidos.</span>}
      {state.status === 'success' && (
        <div className="success">
          <h3>Usuario válido</h3>
          <p><b>ID:</b> {state.user.userId}</p>
          <p><b>Nombre:</b> {state.user.name}</p>
        </div>
      )}
    </div>
  );
}
