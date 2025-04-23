const AddedTask = require("../../Domains/tasks/entities/AddedTask");
const TaskRepository = require("../../Domains/tasks/TaskRepository");

class TaskRepositoryPostgres extends TaskRepository{
  constructor({ pool, idGenerator }) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addTask(payload) {
    const {
      title,
      description,
      status,
      priority,
      due_date,
      projectId,
      assigneeId,
      created_by
    } = payload;

    const id = `task-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO tasks VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      values: [
        id,
        title,
        description || null,
        status || 'todo',
        priority || 'low',
        due_date || null,
        projectId,
        created_by,
        assigneeId || null,
        date,
        date,],
    };

    const result = await this._pool.query(query);
    return new AddedTask({ ...result.rows[0] });
  }
}

module.exports = TaskRepositoryPostgres;