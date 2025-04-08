const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase');
const AuthenticationRepository = require('../../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');

describe('RefreshAuthenticationUseCase', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const payload = {};
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

    // Action & Assert
    await expect(refreshAuthenticationUseCase.execute(payload)).rejects.toThrow('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });
  
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const payload = {
      refreshToken: [],
    };
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({});

    // Action & Assert
    await expect(refreshAuthenticationUseCase.execute(payload)).rejects.toThrow('REFRESH_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating refresh authentication use case correctly', async () => {
    // Arrange
    const payload = {
      refreshToken: 'refreshToken',
    };

    // mock needed classes
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    //mock needed functions
    mockAuthenticationTokenManager.verifyRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'username' }));
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve({ accessToken: 'access_token' }));

    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationTokenManager: mockAuthenticationTokenManager,
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    const newAuth = await refreshAuthenticationUseCase.execute(payload);

    // Assert
    expect(newAuth).toEqual({
      accessToken: 'access_token',
    });
    expect(mockAuthenticationTokenManager.verifyRefreshToken).toHaveBeenCalledWith(payload.refreshToken);
    expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(payload.refreshToken);
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.refreshToken);
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({ id: 'user-123', username: 'username' });
  });
});