const InvariantError = require('../InvariantError');
const ClientError = require('../ClientError');

describe('InvariantError', () => {
  it('should create error correctly', () => {
    const invariantError = new InvariantError('invariant error');

    expect(invariantError).toBeInstanceOf(InvariantError);
    expect(invariantError).toBeInstanceOf(ClientError);
    expect(invariantError).toBeInstanceOf(Error);

    expect(invariantError.statusCode).toEqual(400);
    expect(invariantError.message).toEqual('invariant error');
    expect(invariantError.name).toEqual('InvariantError');
  });
});