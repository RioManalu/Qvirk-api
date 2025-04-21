const Member = require("../../../Domains/members/entities/Member");

class AddMemberUseCase {
  constructor({ memberRepository, authenticationTokenManager }) {
    this._memberRepository = memberRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(payload) {
    const member = new Member(payload);
    const { id: userId } = await this._authenticationTokenManager.decodePayload(payload.token);
    return this._memberRepository.addMember({
      ...member,
      userId,
    });
  }
}

module.exports = AddMemberUseCase;