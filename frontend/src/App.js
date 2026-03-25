import React, { useState } from 'react';
import UserValidationResult from './components/UserValidationResult';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Simulación de validación
  const handleValidate = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      // Simula respuesta exitosa
      setData({ valid: true, userId: 1, name: 'Juan Pérez' });
      setLoading(false);
    }, 1500);
  };

  return (
    <main style={{ maxWidth: 500, margin: '2rem auto', padding: 16 }}>
      <button onClick={handleValidate}>Validar usuario</button>
      <UserValidationResult loading={loading} error={error} data={data} />
    </main>
  );
}
