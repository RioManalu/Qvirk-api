const AddUserUseCase = require('../AddUserUseCase');
const UserRepository = require('../../../../Domains/users/UserRepository');
const PasswordHash = require('../../../security/Passwordhash');
const RegisteredUser = require('../../../../Domains/users/entities/RegisteredUser');
const RegisterUser = require('../../../../Domains/users/entities/RegisterUser');

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const payload = {
      username: 'username',
      password: 'password',
      fullname: 'fullname',
    };

    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      username: 'username',
      fullname: 'fullname',
    });

    // mock needed classes
    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // mock needed functions
    mockUserRepository.verifyAvailableUsername = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(mockRegisteredUser));
    
    // Action
    const addedUser = await addUserUseCase.execute(payload);

    // Assert
    expect(addedUser).toStrictEqual(new RegisteredUser({
      id: 'user-123',
      username: payload.username,
      fullname: payload.fullname,
    }));

    expect(mockUserRepository.verifyAvailableUsername).toHaveBeenCalledWith(payload.username);
    expect(mockPasswordHash.hash).toHaveBeenCalledWith(payload.password);
    expect(mockUserRepository.addUser).toHaveBeenCalledWith(new RegisterUser({
      username: payload.username,
      password: 'encrypted_password',
      fullname: payload.fullname,
    }))
  })
})