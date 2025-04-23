/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createType('status', ['todo', 'in_progress', 'done']);
  pgm.createType('priority', ['low', 'medium', 'high', 'urgent']);
  pgm.createTable('tasks', {
    id: {
      type: 'VARCHAR(100)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    description: {
      type: 'TEXT',
    },
    status: {
      type: 'status',
      default: 'todo',
    },
    priority: {
      type: 'priority',
      default: 'low',
    },
    due_date: {
      type: 'TIMESTAMPTZ',
    },
    project_id: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    created_by: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    assignee_id: {
      type: 'VARCHAR(100)',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      default: 'NOW()',
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      default: 'NOW()',
    },
  });

  pgm.addConstraint('tasks', 'fk_tasks.project_id_projects.id', 'FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE');
  pgm.addConstraint('tasks', 'fk_tasks.created_by_users.id', 'FOREIGN KEY(created_by) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('tasks', 'fk_tasks.assignee_id_users.id', 'FOREIGN KEY(assignee_id) REFERENCES users(id)');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('tasks');
};
