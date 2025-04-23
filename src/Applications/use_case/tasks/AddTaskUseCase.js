const Task = require('../../../Domains/tasks/entities/Task');

class AddTaskUseCase {
  constructor({ taskRepository, projectRepository, memberRepository, authenticationTokenManager}) {
    this._taskRepository = taskRepository;
    this._projectRepository = projectRepository;
    this._memberRepository = memberRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(payload) {
    const task = new Task(payload);
    const { id: userId } = await this._authenticationTokenManager.decodePayload(payload.token);
    await this._projectRepository.verifyProjectOwner(payload.projectId, userId);

    if(task.assigneeId) {
      await this._memberRepository.getMemberById(payload.projectId, task.assigneeId);
    }
    
    return this._taskRepository.addTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      projectId: payload.projectId,
      assigneeId: task.assigneeId,
      created_by: userId,
    });
  }
}

module.exports = AddTaskUseCase;