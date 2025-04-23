/* istanbul ignore file */
const pool = require('../../config/database/postgres/pool');
const date = new Date();

const TasksTableTestHelper = {
  async addTask({
    id= 'task-123',
    title= 'task-title',
    description= 'task-description',
    status= 'todo',
    priority= 'low',
    due_date= date,
    project_id= 'project-123',
    created_by= 'user-123',
    assignee_id= 'user-234',
    created_at= date,
    updated_at= date,
  }) {
    const query = {
      text: 'INSERT INTO tasks VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      values: [id, title, description, status, priority, due_date, project_id, created_by, assignee_id, created_at, updated_at],
    };

    await pool.query(query);
  },

  async findTaskById(taskId) {
    const query = {
      text: 'SELECT id FROM tasks WHERE id = $1',
      values: [taskId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM tasks WHERE 1=1');
  },
}

module.exports = TasksTableTestHelper;