const Project = require('../Project');

describe('Project entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      name: 'project_name',
    };
    
    // Action & Assert
    expect(() => new Project(payload)).toThrow('PROJECT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      name: 123,
      description: {},
      created_by: [],
    };
    
    // Action & Assert
    expect(() => new Project(payload)).toThrow('PROJECT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create project object correctly', () => {
    // Arrange
    const payload = {
      name: 'project-name',
      description: 'project-description',
      created_by: 'user-123',
    };

    // Action
    const project = new Project(payload);

    // Assert
    expect(project.name).toEqual(payload.name);
    expect(project.description).toEqual(payload.description);
    expect(project.created_by).toEqual(payload.created_by);
  });
});