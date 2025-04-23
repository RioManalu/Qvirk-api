const AddedTask = require('../AddedTask');

describe('AddedTask entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'task-123',
      title: 'title',
      project_id: 'project-123',
    };

    // Action & Assert
    expect(() => new AddedTask(payload)).toThrow('ADDED_TASK.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: [],
      status: 123,
      priority: 'low',
      project_id: {},
      created_by: 'user-123',
      created_at: 3,
      updated_at: 'date',
    };

    // Action & Assert
    expect(() => new AddedTask(payload)).toThrow('ADDED_TASK.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create object added task correctly', () => {
    // Arrange
    const date = new Date();
    const payload = {
      id: 'task-123',
      title: 'title',
      status: 'todo',
      priority: 'low',
      project_id: 'project-123',
      created_by: 'user-123',
      created_at: date,
      updated_at: date,
    };

    // Action
    const addedTask = new AddedTask(payload);

    // Assert
    expect(addedTask.id).toEqual(payload.id);
    expect(addedTask.title).toEqual(payload.title);
    expect(addedTask.status).toEqual(payload.status);
    expect(addedTask.priority).toEqual(payload.priority);
    expect(addedTask.project_id).toEqual(payload.project_id);
    expect(addedTask.created_by).toEqual(payload.created_by);
    expect(addedTask.created_at).toEqual(payload.created_at);
    expect(addedTask.updated_at).toEqual(payload.updated_at);
  });

  it('should create object added task correctly', () => {
    // Arrange
    const date = new Date();
    const payload = {
      id: 'task-123',
      title: 'title',
      description: 'description',
      status: 'todo',
      priority: 'low',
      project_id: 'project-123',
      created_by: 'user-123',
      assignee_id: 'user-234',
      created_at: date,
      updated_at: date,
    };

    // Action
    const addedTask = new AddedTask(payload);

    // Assert
    expect(addedTask.id).toEqual(payload.id);
    expect(addedTask.title).toEqual(payload.title);
    expect(addedTask.description).toEqual(payload.description);
    expect(addedTask.status).toEqual(payload.status);
    expect(addedTask.priority).toEqual(payload.priority);
    expect(addedTask.project_id).toEqual(payload.project_id);
    expect(addedTask.created_by).toEqual(payload.created_by);
    expect(addedTask.assignee_id).toEqual(payload.assignee_id);
    expect(addedTask.created_at).toEqual(payload.created_at);
    expect(addedTask.updated_at).toEqual(payload.updated_at);
  });
});