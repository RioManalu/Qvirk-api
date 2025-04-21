class Member {
  constructor(payload) {
    this._verifyPayload(payload);

    const { projectId, role } = payload;
    this.projectId = projectId;
    this.role = role;
  }

  _verifyPayload({ projectId, role }) {
    if(!projectId || !role) {
      throw new Error('MEMBER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if(typeof projectId !== 'string' || typeof role !== 'string') {
      throw new Error('MEMBER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Member;