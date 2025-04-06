const pool = require('../../../../config/database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/testHelper/UsersTableTestHelper');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const InvariantError = require('../../../Commons/Exeptions/InvariantError');

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
});