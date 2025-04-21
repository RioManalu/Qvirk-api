const AddedProject = require('../../Domains/projects/entities/AddedProject');
const ProjectRepository = require('../../Domains/projects/ProjectRepository');
const NotFoundError = require('../../Commons/Exeptions/NotFoundError');
const AuthorizationError = require('../../Commons/Exeptions/AuthorizationError');

class ProjectRepositoryPostgres extends ProjectRepository{
  constructor({ pool, idGenerator }) {
    super();
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

  async getProjectById(id) {
    const query = {
      text: `SELECT projects.name, projects.description, users.username as owner, projects.created_at, projects.updated_at
            FROM projects
            JOIN users
            ON projects.created_by = users.id
            WHERE projects.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async verifyProjectOwner(id, owner) {
    const query = {
      text: 'SELECT created_by FROM projects WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if(!result.rows.length) {
      throw new NotFoundError('Project Not Found');
    }

    const verified = result.rows[0].created_by === owner;

    if(!verified) {
      throw new AuthorizationError('Access Denied');
    }
  }

  async editProjectById(payload) {
    const { projectId, name, description } = payload;
    const query = {
      text: `UPDATE projects
            SET
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            updated_at = NOW()
            WHERE id = $3
            RETURNING name, description, updated_at`,
      values: [name, description, projectId],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async deleteProjectById(id) {
    const query = {
      text: 'DELETE FROM projects WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }
}

module.exports = ProjectRepositoryPostgres;