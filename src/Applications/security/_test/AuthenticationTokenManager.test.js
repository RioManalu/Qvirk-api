const AuthenticationTokenManager = require('../AuthenticationTokenManger');

describe('AuthenticationTokenManager', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const authenticationTokenManager = new AuthenticationTokenManager();

    // Action & Arrange
    await expect(authenticationTokenManager.createAccessToken('')).rejects.toThrow('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(authenticationTokenManager.createRefreshToken('')).rejects.toThrow('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(authenticationTokenManager.verifyRefreshToken('')).rejects.toThrow('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(authenticationTokenManager.decodePayload('')).rejects.toThrow('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  })
})