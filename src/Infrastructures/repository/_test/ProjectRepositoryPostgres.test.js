const ProjectRepositoryPostgres = require('../ProjectRepositoryPostgres');
const pool = require('../../../../config/database/postgres/pool');
const ProjectsTableTestHelper = require('../../../../tests/testHelper/ProjectsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/testHelper/UsersTableTestHelper');

describe('ProjectRepositoryPostgres', () => {
  afterEach(async () => {
    await ProjectsTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addProject function', () => {
    it('should persist add project to database', async () => {
      // Arrange
      const payload = {
        name: 'project-name',
        description: 'project-description',
        created_by: 'user-123',
      };
      const idGenerator = () => 123;
      const projectRepositoryPostgres = new ProjectRepositoryPostgres({ pool, idGenerator });

      // make a user (dependency for fk_projects.created_by_users.id)
      await UsersTableTestHelper.addUser({});

      // Action
      const addedProject = await projectRepositoryPostgres.addProject(payload);

      // Assert
      expect(await ProjectsTableTestHelper.findProjectById(addedProject.id)).toHaveLength(1);
    });

    it('should return added project correctly', async () => {
      // Arrange
      const payload = {
        name: 'project-name',
        description: 'project-description',
        created_by: 'user-123',
      };
      const idGenerator = () => 123;
      const projectRepositoryPostgres = new ProjectRepositoryPostgres({ pool, idGenerator });

      // make a user (dependency for fk_projects.created_by_users.id)
      await UsersTableTestHelper.addUser({});

      // Action
      const addedProject = await projectRepositoryPostgres.addProject(payload);

      // Assert
      expect(addedProject.id).toEqual('project-123');
      expect(addedProject.name).toEqual(payload.name);
      expect(addedProject.created_by).toEqual(payload.created_by);
    });
  });
});