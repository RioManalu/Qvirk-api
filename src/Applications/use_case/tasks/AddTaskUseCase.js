const Task = require('../../../Domains/tasks/entities/Task');

class AddTaskUseCase {
  constructor({ 
    taskRepository, 
    projectRepository, 
    memberRepository, 
    authenticationTokenManager, 
    activityLogRepository }) {
    this._taskRepository = taskRepository;
    this._projectRepository = projectRepository;
    this._memberRepository = memberRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._activityLogRepository = activityLogRepository;
  }

  async execute(payload) {
    const task = new Task(payload);
    const { id: userId } = await this._authenticationTokenManager.decodePayload(payload.token);
    await this._projectRepository.verifyProjectOwner(payload.projectId, userId);

    if(task.assigneeId) {
      await this._memberRepository.getMemberById(payload.projectId, task.assigneeId);
    }
    
    const addedTask = await this._taskRepository.addTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      projectId: payload.projectId,
      assigneeId: task.assigneeId,
      created_by: userId,
    });

    await this._activityLogRepository.addLog({
      action: 'add task',
      new_value: task.title,
      taskId: addedTask.id,
      userId: userId,
    });

    return addedTask;
  }
}

module.exports = AddTaskUseCase;