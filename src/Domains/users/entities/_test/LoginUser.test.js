const LoginUser = require('../LoginUser');

describe('LoginUser entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'username',
    };

    expect(() => new LoginUser(payload)).toThrow('LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      username: 123,
      password: [],
    };

    expect(() => new LoginUser(payload)).toThrow('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create loginUser object correctly', () => {
    // Arrange
    const payload = {
      username: 'username',
      password: 'password',
    };

    // Action
    const loginUser = new LoginUser(payload);

    // Assert
    expect(loginUser.username).toEqual(payload.username);
    expect(loginUser.password).toEqual(payload.password);
  });
});