const MemberRepository = require('../../Domains/members/MemberRepository');

class MemberRepositoryPostgres extends MemberRepository {
  constructor({ pool }) {
    super();
    this._pool = pool;
  };

  async addMember(payload) {
    const { projectId, userId, role } = payload;
    const query = {
      text: 'INSERT INTO project_members VALUES($1, $2, $3) RETURNING *',
      values: [projectId, userId, role],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

module.exports = MemberRepositoryPostgres;