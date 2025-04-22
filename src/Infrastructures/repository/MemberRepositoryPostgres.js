const NotFoundError = require('../../Commons/Exeptions/NotFoundError');
const MemberRepository = require('../../Domains/members/MemberRepository');

class MemberRepositoryPostgres extends MemberRepository {
  constructor({ pool }) {
    super();
    this._pool = pool;
  };

  async searchProject(projectId) {
    const query = {
      text: 'SELECT id FROM projects WHERE id = $1',
      values: [projectId],
    };

    const result = await this._pool.query(query);
    if(!result.rows.length) {
      throw new NotFoundError('Project Not Found');
    }
  }

  async addMember(payload) {
    const { projectId, userId, role } = payload;
    const query = {
      text: 'INSERT INTO project_members VALUES($1, $2, $3) RETURNING *',
      values: [projectId, userId, role],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getMembers(projectId) {
    const query = {
      text: 'SELECT * FROM project_members WHERE project_id = $1',
      values: [projectId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = MemberRepositoryPostgres;