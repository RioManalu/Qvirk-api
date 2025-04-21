/* istanbul ignore file */
const pool = require('../../config/database/postgres/pool');

const MembersTableTestHelper = {
  async addMember({
    project_id = 'project-123', user_id = 'user-123', role = 'member',
  }) {
    const query = {
      text: 'INSERT INTO project_members VALUES($1, $2, $3, $4, $5, $6)',
      values: [project_id, user_id, role],
    };

    await pool.query(query);
  },

  async findMemberById(project_id, user_id) {
    const query = {
      text: 'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
      values: [project_id, user_id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM project_members WHERE 1=1');
  },
}

module.exports = MembersTableTestHelper;