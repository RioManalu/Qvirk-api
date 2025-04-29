/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('task_comments', {
    id: {
      type: 'VARCHAR(100)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    task_id: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(100)',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      default: 'NOW()',
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      default: 'NOW()',
    }
  });

  pgm.addConstraint('task_comments', 'fk_task_comments.task_id_tasks.id', 'FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE');
  pgm.addConstraint('task_comments', 'fk_task_comments.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('task_comments');
};
