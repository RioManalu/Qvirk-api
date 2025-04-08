const Auth = require('../Auth');

describe('Auth entity', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
    };

    // Action & Assert
    expect(() => new Auth(payload)).toThrow('AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      accessToken: 123,
      refreshToken: {},
    };

    // Action & Assert
    expect(() => new Auth(payload)).toThrow('AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create new auth object correctly', () => {
    // Arrange
    const payload = {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    };

    // Action
    const auth = new Auth(payload);

    // Assert
    expect(auth).toStrictEqual(new Auth({
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken,
    }));
  });
});