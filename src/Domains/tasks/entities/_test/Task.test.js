const Task = require('../Task');

describe('Task entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {};

    // Assert
    expect(() => new Task(payload)).toThrow('TASK.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: {},
    };

    // Assert
    expect(() => new Task(payload)).toThrow('TASK.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create task object correctly', () => {
    // Arrange
    const payload = {
      title: 'task-title',
    };

    // Action
    const task = new Task(payload);

    // Assert
    expect(task.title).toEqual(payload.title);
    expect(task.assigneeId).toEqual(payload.assigneeId);
  });

  it('should create task with optional properties correctly', () => {
    // Arrange
    const payload = {
      title: 'task-title',
      description: 'description',
      status: 'todo',
      assigneeId: 'user-234',
    };

    // Action
    const task = new Task(payload);

    // Assert
    expect(task.title).toEqual(payload.title);
    expect(task.description).toEqual(payload.description);
    expect(task.status).toEqual(payload.status);
    expect(task.assigneeId).toEqual(payload.assigneeId);
  });
});