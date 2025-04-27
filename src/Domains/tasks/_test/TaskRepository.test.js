const TaskRepository = require('../TaskRepository');

describe('TaskRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const taskRepository = new TaskRepository();

    // Action
    await expect(taskRepository.addTask).rejects.toThrow('TASK_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(taskRepository.getTasks).rejects.toThrow('TASK_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(taskRepository.getTaskById).rejects.toThrow('TASK_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(taskRepository.editTaskById).rejects.toThrow('TASK_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(taskRepository.deleteTaskById).rejects.toThrow('TASK_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});