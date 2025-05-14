/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('activity_logs', {
    id: {
      type: 'VARCHAR(100)',
      primaryKey: true,
    },
    action: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    new_value: {
      type: 'TEXT',
    },
    task_id: {
      type: 'VARCHAR(100)',
    },
    user_id: {
      type: 'VARCHAR(100)',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      default: 'NOW()',
    },
  });

  pgm.addConstraint('activity_logs', 'fk_activity_logs.task_id_tasks.id', 'FOREIGN KEY(task_id) REFERENCES tasks(id) ON DELETE CASCADE');
  pgm.addConstraint('activity_logs', 'fk_activity_logs.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('activity_logs');
};
