const LogoutUserUseCase = require('../LogoutUserUseCase');
const AuthenticationRepository = require('../../../../Domains/authentications/AuthenticationRepository');

describe('LogoutUserUseCase', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const payload = {};
    const logoutUserUseCase = new LogoutUserUseCase({});

    // Action & Assert
    await expect(logoutUserUseCase.execute(payload)).rejects.toThrow('LOGOUT_USER_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error when payload not meet data type specification', async () => {
    // Arrange
    const payload = {
      refreshToken: {},
    };
    const logoutUserUseCase = new LogoutUserUseCase({});

    // Action & Assert
    await expect(logoutUserUseCase.execute(payload)).rejects.toThrow('LOGOUT_USER_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating logout user use case correctly', async () => {
    // Arrange
    const payload = {
      refreshToken: 'refreshToken',
    };

    // mock needed classes
    const mockAuthenticationRepository = new AuthenticationRepository();

    // mock needed functions
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthenticationRepository.deleteToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    await logoutUserUseCase.execute(payload);

    // Assert
    expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(payload.refreshToken);
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(payload.refreshToken);
  });
});