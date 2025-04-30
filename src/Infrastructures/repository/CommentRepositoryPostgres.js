const CommentRepository = require("../../Domains/comments/CommentRepository");
const NotFoundError = require('../../Commons/Exeptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository{
  constructor({ pool, idGenerator }) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(payload) {
    const { taskId, content, userId } = payload;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date();

    const query = {
      text: 'INSERT INTO task_comments VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
      values: [id, content, taskId, userId, date, date],
    };
    
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getComments(taskId) {
    const query = {
      text: `SELECT task_comments.id, task_comments.content, task_comments.task_id, users.username
            FROM task_comments
            JOIN tasks
            ON task_comments.task_id = tasks.id
            JOIN users
            ON task_comments.user_id = users.id
            WHERE task_id = $1
            ORDER BY task_comments.updated_at ASC`,
      values: [taskId],
    };
    
    const result = await this._pool.query(query);
    return result.rows;
  }

  async editCommentById(payload) {
    const { commentId, content } = payload;
    const query = {
      text: 'UPDATE task_comments SET content = $1 WHERE id = $2 RETURNING content',
      values: [content, commentId],
    };
    
    const result = await this._pool.query(query);
    if(!result.rows.length) {
      throw new NotFoundError('Comment Not Found');
    }
    return result.rows[0];
  }
}

module.exports = CommentRepositoryPostgres;