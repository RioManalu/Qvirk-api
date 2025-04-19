const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../Domains/users/UserRepository');
const InvariantError = require('../../Commons/Exeptions/InvariantError');
const NotFoundError = require('../../Commons/Exeptions/NotFoundError');

class UserRepositoryPostgres extends UserRepository {
  constructor({ pool, idGenerator }) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addUser(payload) {
    const { username, password, fullname } = payload;
    const id = `user-${this._idGenerator()}`;
    const date = new Date();
    const created_at = date;
    const updated_at = date;

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id, username, fullname',
      values: [id, username, password, fullname, created_at, updated_at],
    };

    const result = await this._pool.query(query);
    return new RegisteredUser({ ...result.rows[0] });
  }

  async verifyAvailableUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
    if(result.rows.length) {
      throw new InvariantError('username is not available');
    }
  }

  async getPasswordByUsername(username) {
    const query = {
      text: 'SELECT password FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
    if(!result.rows.length) {
      throw new InvariantError('Username not found');
    }
    
    return result.rows[0].password;
  }

  async getIdByUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };

    const result = await this._pool.query(query);
    if(!result.rows.length) {
      throw new NotFoundError('Username not found');
    }

    return result.rows[0].id;
  }
  
  async verifyUserAccess(id, username) {
    const userId = await this.getIdByUsername(username);
    const verified = id === userId;
    if(!verified) {
      throw new InvariantError('User does not match');
    }
  }
}

module.exports = UserRepositoryPostgres;