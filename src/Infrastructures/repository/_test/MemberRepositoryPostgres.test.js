const MemberRepositoryPostgres = require('../MemberRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/testHelper/UsersTableTestHelper');
const ProjectsTableTestHelper = require('../../../../tests/testHelper/ProjectsTableTestHelper');
const MembersTableTestHelper = require('../../../../tests/testHelper/MembersTableTestHelper');
const pool = require('../../../../config/database/postgres/pool');

describe('MemberRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await ProjectsTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await MembersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addMember function', () => {
    it('should persist add member to database', async () => {
      // Arrange
      const payload = {
        projectId: 'project-123',
        role: 'member',
        userId: 'user-123'
      };

      await UsersTableTestHelper.addUser({});
      await ProjectsTableTestHelper.addProject({});

      const memberRepositoryPostgres = new MemberRepositoryPostgres({ pool });

      // Action
      const addedMember = await memberRepositoryPostgres.addMember(payload);

      // Assert
      expect(await MembersTableTestHelper.findMemberById(addedMember.project_id, addedMember.user_id));
    });

    it('should persist add member to database', async () => {
      // Arrange
      const payload = {
        projectId: 'project-123',
        role: 'member',
        userId: 'user-123'
      };

      await UsersTableTestHelper.addUser({});
      await ProjectsTableTestHelper.addProject({});

      const memberRepositoryPostgres = new MemberRepositoryPostgres({ pool });

      // Action
      const addedMember = await memberRepositoryPostgres.addMember(payload);

      // Assert
      expect(addedMember).toStrictEqual({
        project_id: 'project-123',
        user_id: 'user-123',
        role: 'member',
      });
    });
  });
});