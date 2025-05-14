class EditTaskByIdUseCase {
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

    if(payload.assigneeId) {
      await this._memberRepository.getMemberById(payload.projectId, payload.assigneeId);
    }
    
    const editedTask = await this._taskRepository.editTaskById({
      taskId: payload.taskId,
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
      due_date: payload.due_date,
      assigneeId: payload.assigneeId,
    });

    await this._activityLogRepository.addLog({
      action: 'edit task',
      new_value: editedTask.title,
      taskId: payload.taskId,
      userId: userId,
    });

    return editedTask;
  }
}

module.exports = EditTaskByIdUseCase;