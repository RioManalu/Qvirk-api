const Member = require('../Member');

describe('Member entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      userId: 'project-123',
    };

    // Action & Assert
    expect(() => new Member(payload)).toThrow('MEMBER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      userId: 123,
      role: {},
    };

    // Action & Assert
    expect(() => new Member(payload)).toThrow('MEMBER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create member object correctly', () => {
    // Arrange
    const payload = {
      userId: 'project-123',
      role: 'member',
    };

    // Action
    const member = new Member(payload);

    // Assert
    expect(member.userId).toEqual(payload.userId);
    expect(member.role).toEqual(payload.role);
  });
});