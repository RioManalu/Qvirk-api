class GetTasksUseCase {
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
    await this._memberRepository.getMemberById(payload.projectId, userId);
    return this._taskRepository.getTasks({
      projectId: payload.projectId,
      status: payload.status,
      priority: payload.priority,
      userId,
    });
  }
}

module.exports = GetTasksUseCase;