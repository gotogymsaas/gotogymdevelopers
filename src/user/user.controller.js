const { validateAffiliateService } = require('./user.service');
const { ValidationError } = require('../common/error');

// POST /api/user/validate
async function validateAffiliateController(req, res) {
  try {
    const { document, birthdate } = req.body;
    if (!document || !birthdate) {
      throw new ValidationError('Faltan campos requeridos: document, birthdate');
    }
    const result = await validateAffiliateService({ document, birthdate });
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = { validateAffiliateController };
