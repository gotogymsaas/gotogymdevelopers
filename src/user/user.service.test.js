const { validateAffiliateService } = require('./user.service');
const repository = require('./user.repository');
const { ValidationError } = require('../common/error');

jest.mock('./user.repository');

describe('validateAffiliateService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe validar correctamente un usuario existente', async () => {
    repository.findUserByDocumentAndBirthdate.mockResolvedValue({
      id: 1,
      name: 'Juan Pérez',
      document: '12345678',
      birthdate: '1990-01-01',
    });
    const result = await validateAffiliateService({ document: '12345678', birthdate: '1990-01-01' });
    expect(result).toEqual({ valid: true, userId: 1, name: 'Juan Pérez' });
    expect(repository.findUserByDocumentAndBirthdate).toHaveBeenCalledWith('12345678', '1990-01-01');
  });

  it('debe lanzar ValidationError si el usuario no existe', async () => {
    repository.findUserByDocumentAndBirthdate.mockResolvedValue(null);
    await expect(validateAffiliateService({ document: '00000000', birthdate: '2000-01-01' }))
      .rejects.toThrow(ValidationError);
    expect(repository.findUserByDocumentAndBirthdate).toHaveBeenCalledWith('00000000', '2000-01-01');
  });

  it('debe lanzar ValidationError si faltan campos', async () => {
    // El controller valida campos, pero si el service se usa directo, debe fallar si falta algo
    await expect(validateAffiliateService({ document: '', birthdate: '' }))
      .rejects.toThrow(ValidationError);
  });

  it('debe manejar errores inesperados del repositorio', async () => {
    repository.findUserByDocumentAndBirthdate.mockRejectedValue(new Error('DB error'));
    await expect(validateAffiliateService({ document: '12345678', birthdate: '1990-01-01' }))
      .rejects.toThrow('DB error');
  });
});
