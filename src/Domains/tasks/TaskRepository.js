class TaskRepository {
  async addTask(payload) {
    throw new Error('TASK_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getTasks(payload) {
    throw new Error('TASK_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getTaskById(payload) {
    throw new Error('TASK_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async editTaskById(payload) {
    throw new Error('TASK_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteTaskById(taskId) {
    throw new Error('TASK_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = TaskRepository;