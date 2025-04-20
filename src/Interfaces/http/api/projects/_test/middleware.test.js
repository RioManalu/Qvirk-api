const editableProjectFields = require('../middlewares');
const AuthorizationError = require('../../../../../Commons/Exeptions/AuthorizationError');
const InvariantError = require('../../../../../Commons/Exeptions/InvariantError');

describe('editableProjectFields middleware', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {};
    mockNext = jest.fn();
  });

  it('should throw Authorization Error when request.body contain uneditable fields', () => {
    // Arrange
    mockReq.body = {
      created_at: 'a date',
    };

    // Action
    editableProjectFields(mockReq, mockRes, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalledWith(new AuthorizationError('Cannot Edit Field'));
  });

  it('should throw Invariant Error when request.body contain uneditable fields', () => {
    // Arrange
    mockReq.body = {
      invalid_field: 'invalid field',
    };

    // Action
    editableProjectFields(mockReq, mockRes, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalledWith(new InvariantError('Invalid Field'));
  });

  it('should prioritize AuthorizationError for mixed fields', () => {
    mockReq.body = { 
      name: 'New Name', // Valid
      created_at: '2023-01-01' // Dilarang
    };
  
    editableProjectFields(mockReq, mockRes, mockNext);
  
    // Harus lempar AuthorizationError, bukan InvariantError
    expect(mockNext).toHaveBeenCalledWith(
      new AuthorizationError('Cannot Edit Field')
    );
  });

  it('should call next() if only editable fields exist', () => {
    // Arrange
    mockReq.body = {
      name: 'name',
    };

    // Action
    editableProjectFields(mockReq, mockRes, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalledWith();
  });
});