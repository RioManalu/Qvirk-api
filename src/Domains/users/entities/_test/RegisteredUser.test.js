const RegisteredUser = require('../RegisteredUser');

describe('RegisteredUser entities', () => {
  it('should throw error when payload not contains needed property', () => {
    // Arrange
    const payload = {
      id: "user-123",
      username: 'username',
    }
    
    // Action & Assert
    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: [],
      username: 123,
      fullname: {},
    }
    
    // Action & Assert
    expect(() => new RegisteredUser(payload)).toThrowError('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  
  it('should create registerUser Object correctly', () => {
    // Arrange
    const paylaod = {
      id: 'user-123',
      username: 'username',
      fullname: 'fullname',
    };

    // Action
    const registerUser = new RegisteredUser(paylaod);

    // Assert
    expect(registerUser.id).toEqual(paylaod.id);
    expect(registerUser.username).toEqual(paylaod.username);
    expect(registerUser.fullname).toEqual(paylaod.fullname);
  });
})