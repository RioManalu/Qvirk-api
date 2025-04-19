const AddedProject = require('../AddedProject');

describe('AddedProject entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'project-123',
      name: 'project-name',
    };

    expect(() => new AddedProject(payload)).toThrow('ADDED_PROJECT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      name: [],
      created_by: {},
    };

    expect(() => new AddedProject(payload)).toThrow('ADDED_PROJECT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create object added project object correctly', () => {
    // Arrange
    const payload = {
      id: 'project-123',
      name: 'project-name',
      created_by: 'user-123',
    };

    // Action
    const addedProject = new AddedProject(payload);

    // Assert
    expect(addedProject.id).toEqual(payload.id);
    expect(addedProject.name).toEqual(payload.name);
    expect(addedProject.created_by).toEqual(payload.created_by);
  });
});