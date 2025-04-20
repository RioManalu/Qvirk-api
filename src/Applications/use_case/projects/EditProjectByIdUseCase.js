class EditProjectUseCase {
  constructor({ projectRepository, authenticationTokenManager }) {
    this._projectRepository = projectRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(payload) {
    const { id: userId } = await this._authenticationTokenManager.decodePayload(payload.token);
    await this._projectRepository.verifyProjectOwner(payload.projectId, userId);
    return this._projectRepository.editProjectById(payload);
  }
}

module.exports = EditProjectUseCase;