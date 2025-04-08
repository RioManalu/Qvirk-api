const JwtTokenManager = require('../JwtTokenManager');
const jwt = require('jsonwebtoken');
const InvariantError = require('../../../Commons/Exeptions/InvariantError');

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create access token correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
      };
      const jwt = {
        sign: jest.fn().mockImplementation(() => 'mock_token'),
      }
      const jwtTokenManager = new JwtTokenManager({ jwt });

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload);

      // Assert
      expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: process.env.ACCESS_TOKEN_AGE,
      });
      expect(accessToken).toEqual('mock_token');
    });
  });

  describe('createRefreshToken function', () => {
    it('should create refresh token correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
      };
      const jwt = {
        sign: jest.fn().mockImplementation(() => 'mock_token'),
      }
      const jwtTokenManager = new JwtTokenManager({ jwt });

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);

      // Assert
      expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
      expect(refreshToken).toEqual('mock_token');
    });
  });

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
      };
      const jwtTokenManager = new JwtTokenManager({ jwt });
      const token = await jwtTokenManager.createAccessToken(payload);

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(token))
      .rejects
      .toThrow(InvariantError);
    });

    it('should not throw InvariantError when verification succeed', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
      };
      const jwtTokenManager = new JwtTokenManager({ jwt });
      const token = await jwtTokenManager.createRefreshToken(payload);

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(token))
        .resolves
        .not.toThrow(InvariantError);
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
      };
      const jwtTokenManager = new JwtTokenManager({ jwt });
      const token = await jwtTokenManager.createAccessToken(payload, process.env.ACCESS_TOKEN_KEY, {
        expiresIn: process.env.ACCESS_TOKEN_AGE,
      });

      // Action
      const decodedPayload = await jwtTokenManager.decodePayload(token, process.env.ACCESS_TOKEN_KEY);

      // Assert
      expect(decodedPayload.id).toEqual(payload.id);
    })
  })
});