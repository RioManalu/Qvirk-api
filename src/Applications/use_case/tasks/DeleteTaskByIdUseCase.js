class DeleteTaskByIdUseCase {
  constructor({ 
    taskRepository,
    projectRepository,
    memberRepository,
    authenticationTokenManager,
  }) {
    this._taskRepository = taskRepository;
    this._projectRepository = projectRepository;
    this._memberRepository = memberRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(payload) {
    const { id: userId } = await this._authenticationTokenManager.decodePayload(payload.token);
    await this._projectRepository.verifyProjectOwner(payload.projectId, userId);
    await this._memberRepository.searchProject(payload.projectId);
    return this._taskRepository.deleteTaskById(payload.taskId);
  }
}

module.exports = DeleteTaskByIdUseCase;