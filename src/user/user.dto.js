// DTO para la solicitud de validación de usuario
type ValidateAffiliateRequest = {
  document: string,
  birthdate: string,
};

// DTO para la respuesta de validación
type ValidateAffiliateResponse = {
  valid: boolean,
  userId?: number,
  name?: string,
  error?: string,
};

module.exports = { ValidateAffiliateRequest, ValidateAffiliateResponse };
