class EditProjectUseCase {
  constructor({ projectRepository, authenticationTokenManager }) {
    this._projectRepository = projectRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(payload) {
    this._verifyPayload(payload);
    const { id: userId } = await this._authenticationTokenManager.decodePayload(payload.token);
    await this._projectRepository.verifyProjectOwner(payload.projectId, userId);
    return this._projectRepository.editProjectById(payload);
  }

  _verifyPayload({ name, description }) {
    if(typeof name !== 'string' || typeof description !== 'string') {
      throw new Error('EDIT_PROJECT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = EditProjectUseCase;