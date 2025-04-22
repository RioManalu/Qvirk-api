class GetMembersUseCase {
  constructor({ memberRepository, authenticationTokenManager }) {
    this._memberRepository = memberRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  };

  async execute(payload) {
    await this._authenticationTokenManager.decodePayload(payload.token);
    await this._memberRepository.searchProject(payload.projectId);
    return this._memberRepository.getMembers(payload.projectId);
  }
}

module.exports = GetMembersUseCase;