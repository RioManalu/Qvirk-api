/* istanbul ignore file */
const pool = require('../../config/database/postgres/pool');
const date = new Date();

const ActivityLogsTableTestHelper = {
  async addLog({
    id= 'activityLog-123', action= 'add task', new_value= 'task-title', task_id= 'task-123', user_id= 'user-234',
  }) {
    const query = {
      text: 'INSERT INTO activity_logs VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, action, new_value, task_id, user_id, date],
    };

    await pool.query(query);
  },

  async findLogById(logId) {
    const query = {
      text: 'SELECT * FROM activity_logs WHERE id = $1',
      values: [logId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM activity_logs WHERE 1=1');
  },
}

module.exports = ActivityLogsTableTestHelper;