/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createType('role_enum', ['admin', 'member', 'viewer']);
  pgm.createTable('project_members', {
    project_id: {
      type: 'VARCHAR(100)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(100)',
      primaryKey: true,
    },
    role: {
      type: 'role_enum',
      notNull: true,
      default: 'member',
    },
  });

  pgm.addConstraint('project_members', 'fk_project_members.project_id_projects.id', 'FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE');
  pgm.addConstraint('project_members', 'fk_project_members.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable('project_members');
};