const PasswordHash = require('../../Applications/security/Passwordhash');
const AuthenticationError = require('../../Commons/Exeptions/AuthenticationError');

class BcryptPasswordHash extends PasswordHash {
  constructor({ bcrypt }, saltRound=10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  async hash(password) {
    return this._bcrypt.hash(password, this._saltRound);
  }

  async comparePassword(password, encryptedPassword) {
    const result = await this._bcrypt.compare(password, encryptedPassword);

    if(!result) {
      throw new AuthenticationError('wrong password');
    }
  }
}

module.exports = BcryptPasswordHash;