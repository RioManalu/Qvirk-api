const Member = require("../../../Domains/members/entities/Member");

class AddMemberUseCase {
  constructor({ memberRepository, projectRepository, authenticationTokenManager }) {
    this._memberRepository = memberRepository;
    this._projectRepository = projectRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(payload) {
    const member = new Member(payload);
    const { id: userId } = await this._authenticationTokenManager.decodePayload(payload.token);
    await this._projectRepository.verifyProjectOwner(payload.projectId, userId);
    return this._memberRepository.addMember({
      projectId: payload.projectId,
      userId: member.userId,
      role: member.role,
    });
  }
}

module.exports = AddMemberUseCase;