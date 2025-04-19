const pool = require('../../../../config/database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/testHelper/UsersTableTestHelper');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const InvariantError = require('../../../Commons/Exeptions/InvariantError');
const NotFoundError = require('../../../Commons/Exeptions/NotFoundError');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addUser function', () => {
    it('should persist register user and return registeredUser correctly', async () => {
      // Arrange
      const payload = new RegisterUser ({
        username: 'username',
        password: 'password',
        fullname: 'fullname',
      });

      const idGenerator = () => 123;  // stub
      const userRepositoryPostgres = new UserRepositoryPostgres({ pool, idGenerator });

      // Action
      const addedUser = await userRepositoryPostgres.addUser(payload);

      // Assert
      expect(await UsersTableTestHelper.findUserById(addedUser.id)).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
      // Arrange
      const payload = new RegisterUser({
        username: 'user',
        password: 'password',
        fullname: 'fullname',
      });

      const idGenerator = () => 123;
      const userRepositoryPostgres = new UserRepositoryPostgres({ pool, idGenerator });

      // Action
      const addedUser = await userRepositoryPostgres.addUser(payload);

      // Assert
      expect(addedUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: payload.username,
        fullname: payload.fullname,
      }));
    });
  });

  describe('verifyAvailableUsername function', () => {
    it('should throw Invariant Error when username is not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const userRepositoryPostgres = new UserRepositoryPostgres({ pool });
      
      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('username')).rejects.toThrow(InvariantError);
    });

    it('should not throw Invariant Error when username is available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({});
      const userRepositoryPostgres = new UserRepositoryPostgres({ pool });
      
      // Action & Assert
      await expect(userRepositoryPostgres.verifyAvailableUsername('username_available'))
        .resolves
        .not.toThrow(InvariantError);
    });
  });

  describe('getPasswordByUsername function', () => {
    it('should throw Invariant Error when user not found', async () => {
      // Arrange
      const username = 'username-salah';
      await UsersTableTestHelper.addUser({});
      const userRepositoryPostgres = new UserRepositoryPostgres({ pool });

      // Action Assert
      await expect(userRepositoryPostgres.getPasswordByUsername(username))
      .rejects
      .toThrow(new InvariantError('Username not found'))
    });

    it('should not throw Invariant Error when user not found', async () => {
      // Arrange
      const username = 'username';
      await UsersTableTestHelper.addUser({});
      const userRepositoryPostgres = new UserRepositoryPostgres({ pool });

      // Action Assert
      await expect(userRepositoryPostgres.getPasswordByUsername(username))
      .resolves
      .not.toThrow(new InvariantError('Username not found'))
    });
  });

  describe('getIdByUsername function', () => {
    it('should throw NotFound Error when user id not found', async () => {
      // Arrange
      const username = 'username-salah';
      await UsersTableTestHelper.addUser({});
      const userRepositoryPostgres = new UserRepositoryPostgres({ pool });

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername(username))
        .rejects
        .toThrow(new NotFoundError('Username not found'));
    });

    it('should not throw NotFound Error when user id not found', async () => {
      // Arrange
      const username = 'username';
      await UsersTableTestHelper.addUser({});
      const userRepositoryPostgres = new UserRepositoryPostgres({ pool });

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByUsername(username))
        .resolves
        .not.toThrow(new NotFoundError('Username not found'));
    });
  });

  describe('verifyUserAccess function', () => {
    it('should throw Invariant Error when user not verified', async () => {
      // Arrange
      const payload = {
        id: 'user-234',
        username: 'username',
      };

      await UsersTableTestHelper.addUser({});
      const userRepositoryPostgres = new UserRepositoryPostgres({ pool });
      
      // Action & Assert
      await expect(userRepositoryPostgres.verifyUserAccess(payload.id, payload.username))
        .rejects
        .toThrow(new InvariantError('User does not match'));
    });

    it('should not throw Invariant Error when user verified', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
        username: 'username',
      };

      await UsersTableTestHelper.addUser({});
      const userRepositoryPostgres = new UserRepositoryPostgres({ pool });
      
      // Action & Assert
      await expect(userRepositoryPostgres.verifyUserAccess(payload.id, payload.username))
        .resolves
        .not.toThrow(InvariantError);
    });
  });
});