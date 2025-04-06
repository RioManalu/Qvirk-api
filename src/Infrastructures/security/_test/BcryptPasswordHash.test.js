const AuthenticationError = require('../../../Commons/Exeptions/AuthenticationError');
const BcryptPasswordHash = require('../BcryptPasswordHash');
const bcrypt = require('bcrypt');

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');  // spy
      const bcryptPasswordHash = new BcryptPasswordHash({ bcrypt });

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      // Assert
      expect(typeof encryptedPassword).toEqual('string');
      expect(encryptedPassword).not.toEqual('plain_password');
      expect(spyHash).toHaveBeenCalledWith('plain_password', 10); // 10 adalah nilai saltRound default untukBcryptPasswordHash
    });
  });

  describe('comparePassword function', () => {
    it('should throw Authentication error when password is not match', async () => {
      // Arrange
      const payload = {
        password: 'password',
        encryptedPassword: 'encryptedPassword',
      };

      const bcryptPasswordHash = new BcryptPasswordHash({ bcrypt });
      await expect(bcryptPasswordHash.comparePassword(payload.password, payload.encryptedPassword))
        .rejects
        .toThrow(AuthenticationError);
    });

    it('should not throw Authentication error when password is match', async () => {
      // Arrange
      const password = 'password';
      const encryptedPassword = await bcrypt.hash(password, 10);
      const bcryptPasswordHash = new BcryptPasswordHash({ bcrypt });

      // Action & Assert
      await expect(bcryptPasswordHash.comparePassword(password, encryptedPassword))
        .resolves
        .not.toThrow(AuthenticationError);
    });
  });
});