const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');
const pool = require('../../../../config/database/postgres/pool');
const AuthenticationsTableTestHelper = require('../../../../tests/testHelper/AuthenticationsTableTestHelper');
const InvariantError = require('../../../Commons/Exeptions/InvariantError');

describe('AuthenticationRepositoryPostgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addToken function', () => {
    it('should add token to database', async () => {
      // Arrange
      const token = 'token';
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres({ pool });

      // Action
      await authenticationRepositoryPostgres.addToken(token);

      // Assert
      const addedToken = await AuthenticationsTableTestHelper.findToken(token);
      expect(addedToken).toHaveLength(1);
      expect(addedToken[0].token).toBe(token);
    });
  });

  describe('checkAvailabilityToken function', () => {
    it('should throw Invariant error when token is not available', async () => {
      // Arrange
      const token = 'token';
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres({ pool });

      // Action & Assert
      await expect(authenticationRepositoryPostgres.checkAvailabilityToken(token)).rejects.toThrow(InvariantError);
    });

    it('should not throw Invariant error when token is not available', async () => {
      // Arrange
      const token = 'token';
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres({ pool });
      await AuthenticationsTableTestHelper.addToken();

      // Action & Assert
      await expect(authenticationRepositoryPostgres.checkAvailabilityToken(token))
        .resolves
        .not.toThrow(InvariantError);
    });
  });

  describe('deleteToken', () => {
    it('should delete token from database correctly', async () => {
      // Arrange
      const token = 'token';
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres({ pool });
      await AuthenticationsTableTestHelper.addToken();

      // Action
      await authenticationRepositoryPostgres.deleteToken(token);

      // Assert
      expect(await AuthenticationsTableTestHelper.findToken(token)).toHaveLength(0);
    });
  });
});