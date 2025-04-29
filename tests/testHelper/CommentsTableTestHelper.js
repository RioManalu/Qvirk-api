/* istanbul ignore file */
const pool = require('../../config/database/postgres/pool');
const date = new Date();

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', content = 'content', task_id = 'task-123', user_id = 'user-234',
  }) {
    const query = {
      text: 'INSERT INTO task_comments VALUES($1, $2, $3, $4, $5, $6)',
      values: [id, content, task_id, user_id, date, date],
    };

    await pool.query(query);
  },

  async findCommentById(commentId) {
    const query = {
      text: 'SELECT * FROM task_comments WHERE id = $1',
      values: [commentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM task_comments WHERE 1=1');
  },
}

module.exports = CommentsTableTestHelper;