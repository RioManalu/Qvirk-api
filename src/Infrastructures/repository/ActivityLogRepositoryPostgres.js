const ActivityLogRepository = require('../../Domains/activityLogs/ActivityLogRepository');

class ActivityLogRepositoryPostgres extends ActivityLogRepository {
  constructor({ pool, idGenerator }) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLog(payload) {
    const { action, new_value, taskId, userId } = payload;
    const id = `activityLog-${this._idGenerator()}`;
    const date = new Date();
    const query = {
      text: 'INSERT INTO activity_logs VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [id, action, new_value, taskId, userId, date]
    }

    const result = await this._pool.query(query);
    return result.rows[0];    
  }

  async getLogs() {
    const query = {
      text: 'SELECT * FROM activity_logs',
      values: []
    }

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ActivityLogRepositoryPostgres;