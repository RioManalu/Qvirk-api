class GetActivityLogsUseCase {
  constructor({ 
    taskRepository, 
    memberRepository,
    authenticationTokenManager,
    activityLogRepository,
  }) {
    this._taskRepository = taskRepository;
    this._memberRepository = memberRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._activityLogRepository = activityLogRepository;
  }

  async execute(payload) {
    const { id: userId } = await this._authenticationTokenManager.decodePayload(payload.token);
    await this._memberRepository.searchProject(payload.projectId);
    await this._memberRepository.getMemberById(payload.projectId, userId);
    await this._taskRepository.getTaskById(payload.taskId);
    return this._activityLogRepository.getLogs();
  }
}

module.exports = GetActivityLogsUseCase;