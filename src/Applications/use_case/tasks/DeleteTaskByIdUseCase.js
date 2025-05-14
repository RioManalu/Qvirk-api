class DeleteTaskByIdUseCase {
  constructor({ 
    taskRepository,
    projectRepository,
    memberRepository,
    authenticationTokenManager,
    activityLogRepository,
  }) {
    this._taskRepository = taskRepository;
    this._projectRepository = projectRepository;
    this._memberRepository = memberRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._activityLogRepository = activityLogRepository;
  }

  async execute(payload) {
    const { id: userId } = await this._authenticationTokenManager.decodePayload(payload.token);
    await this._projectRepository.verifyProjectOwner(payload.projectId, userId);
    await this._memberRepository.searchProject(payload.projectId);
    const deletedTask = await this._taskRepository.deleteTaskById(payload.taskId);

    await this._activityLogRepository.addLog({
      action: 'delete task',
      new_value: null,
      taskId: payload.taskId,
      userId: userId,
    });
  }
}

module.exports = DeleteTaskByIdUseCase;