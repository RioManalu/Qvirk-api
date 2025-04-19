/* istanbul ignore file */
const pool = require('../../config/database/postgres/pool');

const date = new Date();
const ProjectsTableTestHelper = {
  async addProject({
    id = 'project-123', name = 'project-name', description = 'project-description', created_by = 'user-123', created_at = date, updated_at = date,
  }) {
    const query = {
      text: 'INSERT INTO projects VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, name, description, created_by, created_at, updated_at],
    };

    await pool.query(query);
  },

  async findProjectById(id) {
    const query = {
      text: 'SELECT * FROM projects WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM projects WHERE 1=1');
  },
}

module.exports = ProjectsTableTestHelper;