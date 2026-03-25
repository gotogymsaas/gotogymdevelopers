const { findUserByDocumentAndBirthdate } = require('./user.repository');
const { ValidationError } = require('../common/error');

async function validateAffiliateService({ document, birthdate }) {
  // Lógica de validación de negocio
  const user = await findUserByDocumentAndBirthdate(document, birthdate);
  if (!user) {
    throw new ValidationError('Usuario no encontrado o datos inválidos');
  }
  // Puedes agregar más reglas de negocio aquí
  return { valid: true, userId: user.id, name: user.name };
}

module.exports = { validateAffiliateService };
