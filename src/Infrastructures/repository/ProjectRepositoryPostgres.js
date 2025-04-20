const AddedProject = require('../../Domains/projects/entities/AddedProject');

class ProjectRepositoryPostgres {
  constructor({ pool, idGenerator }) {
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addProject(project) {
    const { name, description, created_by } = project;
    const id = `project-${this._idGenerator()}`;
    const date = new Date();
    const created_at = date;
    const updated_at = date;

    const query = {
      text: 'INSERT INTO projects VALUES($1, $2, $3, $4, $5, $6) RETURNING id, name, created_by',
      values: [id, name, description, created_by, created_at, updated_at]
    }
    
    const result = await this._pool.query(query);

    return new AddedProject({ ...result.rows[0] });
  }

  async getProjects(owner) {
    const query = {
      text: `SELECT projects.name, projects.description, users.username as owner
            FROM projects
            JOIN users
            ON projects.created_by = users.id
            WHERE projects.created_by = $1
            ORDER BY projects.created_at`,
      values: [owner],
    }

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = ProjectRepositoryPostgres;