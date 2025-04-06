const RegisterUser = require('../RegisterUser');

describe('RegisterUser entities', () => {
  it('should throw error when payload not contains needed property', () => {
    // Arrange
    const payload = {
      username: 'username',
      password: 'password',
    }
    
    // Action & Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      username: 123,
      password: [],
      fullname: {},
    }
    
    // Action & Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when username contains more than 50 characters', () => {
    // Arrange
    const payload = {
      username: 'aslfidhasiudhfioasfasofjahsfihiaushfahsifhasfihaosifhiashdfasfdasdfosagihuohisadfhiohasifh',
      password: 'password',
      fullname: 'fullname',
    }
    
    // Action & Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_LIMIT_CHAR');
  });

  it('should throw error when username contains restricted character', () => {
    // Arrange
    const payload = {
      username: 'user name',
      password: 'password',
      fullname: 'fullname',
    }
    
    // Action & Assert
    expect(() => new RegisterUser(payload)).toThrowError('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
  });
  
  it('should create registerUser Object correctly', () => {
    // Arrange
    const paylaod = {
      username: 'username',
      password: 'password',
      fullname: 'fullname',
    };

    // Action
    const registerUser = new RegisterUser(paylaod);

    // Assert
    expect(registerUser.username).toEqual(paylaod.username);
    expect(registerUser.password).toEqual(paylaod.password);
    expect(registerUser.fullname).toEqual(paylaod.fullname);
  });
});