const AddedTask = require("../../Domains/tasks/entities/AddedTask");
const TaskRepository = require("../../Domains/tasks/TaskRepository");
const NotFoundError = require('../../Commons/Exeptions/NotFoundError');

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

  async getTasks(payload) {
    const projectId = payload.projectId;
    const status = payload.status ?? null;
    const priority = payload.priority ?? null;
    const assigneeId = payload.assigneeId ?? null;
    const query = {
      text: `SELECT * FROM tasks WHERE project_id = $1 
            AND (status = $2 OR $2 IS NULL)
            AND (priority = $3 OR $3 IS NULL)
            AND (assignee_id = $4 OR $4 IS NULL)`,
      values: [projectId, status, priority, assigneeId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async getTaskById(taskId) {
    const query = {
      text: 'SELECT * FROM tasks WHERE id = $1',
      values: [taskId],
    }

    const result = await this._pool.query(query);
    if(!result.rows.length) {
      throw new NotFoundError('Task Not Found');
    }

    return result.rows[0];
  }

  async editTaskById(payload) {
    const {
      taskId,
      title,
      description,
      status,
      priority,
      due_date,
      assigneeId
    } = payload;

    const date = new Date();

    const query = {
      text: `UPDATE tasks 
            SET 
            title = COALESCE($2, title),
            description = COALESCE($3, description),
            status = COALESCE($4, status),
            priority = COALESCE($5, priority),
            due_date = COALESCE($6, due_date),
            assignee_id = COALESCE($7, assignee_id),
            updated_at = $8
            WHERE id = $1
            RETURNING title, description, status, priority, due_date, assignee_id`,
      values: [taskId, title, description, status, priority, due_date, assigneeId, date],
    }

    const result = await this._pool.query(query);
    if(!result.rows.length) {
      throw new NotFoundError('Task Not Found');
    }

    return result.rows[0];
  }

  async deleteTaskById(taskId) {
    const query = {
      text: 'DELETE FROM tasks WHERE id = $1 RETURNING title',
      values: [taskId],
    }

    const result = await this._pool.query(query);
    if(!result.rows.length) {
      throw new NotFoundError('Task Not Found');
    }

    return result.rows[0];
  }
}

module.exports = TaskRepositoryPostgres;