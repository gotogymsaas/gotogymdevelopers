import { useState } from 'react';
import { validarUsuario } from '../api/userService';

export function useUsuario() {
  const [loading, setLoading] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState('');

  const validar = async ({ document, birthdate }) => {
    setLoading(true);
    setError('');
    setUsuario(null);
    try {
      const data = await validarUsuario({ document, birthdate });
      setUsuario(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, usuario, error, validar };
}
