const AuthenticationTokenManager = require("../../Applications/security/AuthenticationTokenManger");
const InvariantError = require("../../Commons/Exeptions/InvariantError");

class JwtTokenManager extends AuthenticationTokenManager {
  constructor({ jwt }) {
    super();
    this._jwt = jwt;
  }

  async createAccessToken(payload) {
    return this._jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_AGE,
    });
  }

  async createRefreshToken(payload) {
    return this._jwt.sign(payload, process.env.REFRESH_TOKEN_KEY);
  }

  async verifyRefreshToken(token) {
    try {
      this._jwt.verify(token, process.env.REFRESH_TOKEN_KEY, {
        expiresIn: process.env.ACCESS_TOKEN_AGE,
      });
    } catch (error) {
      throw new InvariantError('invalid refresh token');
    }
  }

  async decodePayload(token) {
    return await this._jwt.decode(token, process.env.ACCESS_TOKEN_KEY);
  }
}

module.exports = JwtTokenManager;