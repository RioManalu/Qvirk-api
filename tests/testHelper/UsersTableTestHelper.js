const pool = require('../../config/database/postgres/pool');

const date = new Date();
const UsersTableTestHelper = {
  async addUser({
    id = 'user-123', username = 'username', password = 'password', fullname = 'fullname', created_at = date, updated_at = date,
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, username, password, fullname, created_at, updated_at],
    };

    await pool.query(query);
  },

  async findUserById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM users WHERE 1=1');
  },
}

module.exports = UsersTableTestHelper;