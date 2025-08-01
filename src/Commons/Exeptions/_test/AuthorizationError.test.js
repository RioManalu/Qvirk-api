const AuthorizationError = require('../AuthorizationError');
const ClientError = require('../ClientError');

describe('AuthorizationError', () => {
  it('should create error correctly', () => {
    const authorizationError = new AuthorizationError('authorization error');

    expect(authorizationError).toBeInstanceOf(AuthorizationError);
    expect(authorizationError).toBeInstanceOf(ClientError);
    expect(authorizationError).toBeInstanceOf(Error);

    expect(authorizationError.statusCode).toEqual(403);
    expect(authorizationError.message).toEqual('authorization error');
    expect(authorizationError.name).toEqual('AuthorizationError');
  });
});