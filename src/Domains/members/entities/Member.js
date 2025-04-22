class Member {
  constructor(payload) {
    this._verifyPayload(payload);

    const { userId, role } = payload;
    this.userId = userId;
    this.role = role;
  }

  _verifyPayload({ userId, role }) {
    if(!userId || !role) {
      throw new Error('MEMBER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if(typeof userId !== 'string' || typeof role !== 'string') {
      throw new Error('MEMBER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Member;