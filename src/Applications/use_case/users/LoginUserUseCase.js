const Auth = require("../../../Domains/authentications/entities/Auth");
const LoginUser = require("../../../Domains/users/entities/LoginUser");

class LoginUserUseCase {
  constructor({
    userRepository,
    passwordHash,
    authenticationTokenManager,
    authenticationRepository,
  }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
    this._authenticationTokenManager = authenticationTokenManager;
    this._authenticationRepository = authenticationRepository;
  };

  async execute(payload) {
    const { username, password } = new LoginUser(payload);
    const encryptedPassword = await this._userRepository.getPasswordByUsername(username);
    await this._passwordHash.comparePassword(password, encryptedPassword);
    const id = await this._userRepository.getIdByUsername(username);
    const accessToken = await this._authenticationTokenManager.createAccessToken({ id, username });
    const refreshToken = await this._authenticationTokenManager.createRefreshToken({ id, username });
    await this._authenticationRepository.addToken(refreshToken);

    const authentication = {
      accessToken,
      refreshToken,
    }

    return new Auth(authentication);
  }
}

module.exports = LoginUserUseCase;