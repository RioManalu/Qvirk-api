const ProjectRepositoryPostgres = require('../ProjectRepositoryPostgres');
const pool = require('../../../../config/database/postgres/pool');
const ProjectsTableTestHelper = require('../../../../tests/testHelper/ProjectsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/testHelper/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/Exeptions/NotFoundError');
const AuthorizationError = require('../../../Commons/Exeptions/AuthorizationError');

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

  describe('getProjects function', () => {
    it('should return projects object correctly', async () => {
      // Arrange
      const payload = {
        owner: 'user-123',
      };

      // prepare dependencies
      await UsersTableTestHelper.addUser({});
      await ProjectsTableTestHelper.addProject({});

      const projectRepositoryPostgres = new ProjectRepositoryPostgres({ pool });

      // Action
      const projects = await projectRepositoryPostgres.getProjects(payload.owner);

      // Assert
      expect(projects).toEqual([{
        name: 'project-name',
        description: 'project-description',
        owner: 'username',
      }]);
    });
  });

  describe('getProjectById function', () => {
    it('should return project object correctly', async () => {
      // Arrange
      const projectId = 'project-123'

      await UsersTableTestHelper.addUser({});
      await ProjectsTableTestHelper.addProject({});

      const projectRepositoryPostgres = new ProjectRepositoryPostgres({ pool });

      // Action
      const project = await projectRepositoryPostgres.getProjectById(projectId);

      // Assert
      expect(project).toStrictEqual({
        name: 'project-name',
        description: 'project-description',
        owner: 'username',
        created_at: new Date(project.created_at),
        updated_at: new Date(project.updated_at),
      });
    });
  });

  describe('verifyProjectOwner', () => {
    it('should throw NotFound Error when project not found', async () => {
      // Arrange
      const payload = {
        id: 'project-234',
        owner: 'user-234',
      };

      await UsersTableTestHelper.addUser({});
      await ProjectsTableTestHelper.addProject({});

      const projectRepositoryPostgres = new ProjectRepositoryPostgres({ pool });

      // Action & Assert
      await expect(projectRepositoryPostgres.verifyProjectOwner(payload.id, payload.owner))
        .rejects
        .toThrow(new NotFoundError('Project Not Found'));
    });

    it('should throw Authorization Error when owner not verified', async () => {
      // Arrange
      const payload = {
        id: 'project-123',
        owner: 'user-234',
      };

      await UsersTableTestHelper.addUser({});
      await ProjectsTableTestHelper.addProject({});

      const projectRepositoryPostgres = new ProjectRepositoryPostgres({ pool });

      // Action & Assert
      await expect(projectRepositoryPostgres.verifyProjectOwner(payload.id, payload.owner))
        .rejects
        .toThrow(new AuthorizationError('Access Denied'));
    });

    it('should not throw NotFound Error and Authorization Error when owner verified', async () => {
      // Arrange
      const payload = {
        id: 'project-123',
        owner: 'user-123',
      };

      await UsersTableTestHelper.addUser({});
      await ProjectsTableTestHelper.addProject({});

      const projectRepositoryPostgres = new ProjectRepositoryPostgres({ pool });

      // Action & Assert
      await expect(projectRepositoryPostgres.verifyProjectOwner(payload.id, payload.owner))
        .resolves
        .not.toThrow(new NotFoundError('Project Not Found'), new AuthorizationError('Access Denied'));
    });
  });

  describe('editProjectById', () => {
    it('should return changes object correctly', async () => {
      // Arrange
      const payload = {
        projectId: 'project-123',
        name: 'new project name',
        description: 'new project description',
      };

      // create dependencies
      await UsersTableTestHelper.addUser({});
      await ProjectsTableTestHelper.addProject({});

      const projectRepositoryPostgres = new ProjectRepositoryPostgres({ pool });

      // Action
      const changes = await projectRepositoryPostgres.editProjectById(payload);

      // Assert
      expect(changes).toStrictEqual({
        name: payload.name,
        description: payload.description,
        updated_at: new Date(changes.updated_at),
      });
    });

    it('should maintain project attribute when not changed', async () => {
      // Arrange
      const payload = {
        projectId: 'project-123',
        name: 'new project name',
      };

      // create dependencies
      await UsersTableTestHelper.addUser({});
      await ProjectsTableTestHelper.addProject({});

      const projectRepositoryPostgres = new ProjectRepositoryPostgres({ pool });

      // Action
      const changes = await projectRepositoryPostgres.editProjectById(payload);

      // Assert
      expect(changes).toStrictEqual({
        name: payload.name,
        description: 'project-description',
        updated_at: new Date(changes.updated_at),
      });
    });
  })
});