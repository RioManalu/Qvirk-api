class GetTaskByIdUseCase {
  constructor({ 
    taskRepository, 
    memberRepository,
    authenticationTokenManager,
  }) {
    this._taskRepository = taskRepository;
    this._memberRepository = memberRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(payload) {
    const { id: userId } = await this._authenticationTokenManager.decodePayload(payload.token);
    await this._memberRepository.searchProject(payload.projectId);
    await this._memberRepository.getMemberById(payload.projectId, userId);
    return this._taskRepository.getTaskById(payload.taskId);
  }
}

module.exports = GetTaskByIdUseCase;