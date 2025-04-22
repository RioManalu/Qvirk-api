class DeleteMemberByIdUseCase {
  constructor({
    memberRepository,
    projectRepository,
    authenticationTokenManager,
  }) {
    this._memberRepository = memberRepository;
    this._projectRepository = projectRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  };

  async execute(payload) {
    const { id: userId } = await this._authenticationTokenManager.decodePayload(payload.token);
    await this._projectRepository.verifyProjectOwner(payload.projectId, userId);
    await this._memberRepository.deleteMemberById(payload.projectId, payload.userId);
  }
}

module.exports = DeleteMemberByIdUseCase;