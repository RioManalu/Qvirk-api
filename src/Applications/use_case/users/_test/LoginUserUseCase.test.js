const LoginUserUseCase = require('../LoginUserUseCase');
const Auth = require('../../../../Domains/authentications/entities/Auth');
const UserRepository = require('../../../../Domains/users/UserRepository');
const PasswordHash = require('../../../../Applications/security/Passwordhash');
const AuthenticationRepository = require('../../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../../../Applications/security/AuthenticationTokenManger');

describe('LoginUserUseCase', () => {
  it('should orchestrating login user use case correctly', async () => {
    // Arrange
    const payload = {
      username: 'username',
      password: 'password',
    };

    const mockAuthentication = new Auth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    // mock needed classes
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockAuthenticationRepository = new AuthenticationRepository();

    // mock needed functions
    mockUserRepository.getPasswordByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockPasswordHash.comparePassword = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.getIdByUsername = jest.fn()
      .mockImplementation(() => Promise.resolve('user-123'));
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAuthentication.accessToken));
    mockAuthenticationTokenManager.createRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAuthentication.refreshToken));
    mockAuthenticationRepository.addToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // make an instance and its dependencies
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
      authenticationTokenManager: mockAuthenticationTokenManager,
      authenticationRepository: mockAuthenticationRepository,
    });

    // Action
    const auth = await loginUserUseCase.execute(payload);

    // Assert
    expect(auth).toStrictEqual(new Auth({
      accessToken: mockAuthentication.accessToken,
      refreshToken: mockAuthentication.refreshToken,
    }));
    expect(mockUserRepository.getPasswordByUsername).toHaveBeenCalledWith(payload.username);
    expect(mockPasswordHash.comparePassword).toHaveBeenCalledWith(payload.password, 'encrypted_password');
    expect(mockUserRepository.getIdByUsername).toHaveBeenCalledWith(payload.username);
    expect(mockAuthenticationTokenManager.createAccessToken).toHaveBeenCalledWith({ id: 'user-123', username: payload.username });
    expect(mockAuthenticationTokenManager.createRefreshToken).toHaveBeenCalledWith({ id: 'user-123', username: payload.username });
    expect(mockAuthenticationRepository.addToken).toHaveBeenCalledWith(mockAuthentication.refreshToken);
  });
});