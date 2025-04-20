class GetProjectsUseCase {
  constructor({ projectRepository, authenticationTokenManager }) {
    this._projectRepository = projectRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(payload) {
    const { id } = await this._authenticationTokenManager.decodePayload(payload);
    return this._projectRepository.getProjects(id);
  }
}

module.exports = GetProjectsUseCase;