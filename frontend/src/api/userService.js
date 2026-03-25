// Permite definir la URL base según entorno
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export async function validarUsuario({ document, birthdate }) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/user/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document, birthdate }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error desconocido');
    }
    return data;
  } catch (error) {
    throw new Error(error.message || 'Error de red');
  }
}
