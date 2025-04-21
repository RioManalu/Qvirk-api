const Member = require('../Member');

describe('Member entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      projectId: 'project-123',
    };

    // Action & Assert
    expect(() => new Member(payload)).toThrow('MEMBER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      projectId: 123,
      role: {},
    };

    // Action & Assert
    expect(() => new Member(payload)).toThrow('MEMBER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create member object correctly', () => {
    // Arrange
    const payload = {
      projectId: 'project-123',
      role: 'member',
    };

    // Action
    const member = new Member(payload);

    // Assert
    expect(member.project_id).toEqual(payload.project_id);
    expect(member.role).toEqual(payload.role);
  });
});