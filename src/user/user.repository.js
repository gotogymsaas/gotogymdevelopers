// Simulación de base de datos
const users = [
  { id: 1, name: 'Juan Pérez', document: '12345678', birthdate: '1990-01-01' },
  { id: 2, name: 'Ana Gómez', document: '87654321', birthdate: '1985-05-10' },
];

async function findUserByDocumentAndBirthdate(document, birthdate) {
  return users.find(u => u.document === document && u.birthdate === birthdate) || null;
}

module.exports = { findUserByDocumentAndBirthdate };
