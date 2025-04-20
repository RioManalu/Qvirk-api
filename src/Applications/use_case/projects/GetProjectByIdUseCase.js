class GetProjectByIdUseCase {
  constructor({ projectRepository, authenticationTokenManager }) {
    this._projectRepository = projectRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(payload) {
    const { id } = await this._authenticationTokenManager.decodePayload(payload.token);
    await this._projectRepository.verifyProjectOwner(payload.projectId, id);
    return this._projectRepository.getProjectById(payload.projectId);
  }
}

module.exports = GetProjectByIdUseCase;