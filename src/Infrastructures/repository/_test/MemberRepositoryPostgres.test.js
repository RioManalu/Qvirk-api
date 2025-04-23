const MemberRepositoryPostgres = require('../MemberRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/testHelper/UsersTableTestHelper');
const ProjectsTableTestHelper = require('../../../../tests/testHelper/ProjectsTableTestHelper');
const MembersTableTestHelper = require('../../../../tests/testHelper/MembersTableTestHelper');
const pool = require('../../../../config/database/postgres/pool');
const NotFoundError = require('../../../Commons/Exeptions/NotFoundError');

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

  describe('searchProject function', () => {
    it('should throw not found error when project is not exist', async () => {
      // Arrange
      const projectId = 'project-234';

      const memberRepositoryPostgres = new MemberRepositoryPostgres({ pool });

      // Action & Assert
      await expect(memberRepositoryPostgres.searchProject(projectId))
        .rejects
        .toThrow(new NotFoundError('Project Not Found'));
    });

    it('should not throw not found error when project is not exist', async () => {
      // Arrange
      const projectId = 'project-123';

      await UsersTableTestHelper.addUser({});
      await ProjectsTableTestHelper.addProject({});

      const memberRepositoryPostgres = new MemberRepositoryPostgres({ pool });

      // Action & Assert
      await expect(memberRepositoryPostgres.searchProject(projectId))
        .resolves
        .not.toThrow(NotFoundError);
    });
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

  describe('getMembers function', () => {
    it('should return members correctly', async () => {
      // Arrange
      const projectId = 'project-123';

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'username-234' });
      await ProjectsTableTestHelper.addProject({});
      await MembersTableTestHelper.addMember({});

      const memberRepositoryPostgres = new MemberRepositoryPostgres({ pool });

      // Action
      const members = await memberRepositoryPostgres.getMembers(projectId);

      // Assert
      expect(members).toStrictEqual([{
        project_id: 'project-123',
        user_id: 'user-234',
        role: 'member',
      }]);
    });
  });

  describe('getMemberById function', () => {
    it('should throw not found error when member not found', async () => {
      // Arrange
      const payload = {
        projectId: 'project-123',
        memberId: 'user-345',
      };

      await UsersTableTestHelper.addUser({});
      await ProjectsTableTestHelper.addProject({});

      const memberRepositoryPostgres = new MemberRepositoryPostgres({ pool });

      // Action
      await expect(() => memberRepositoryPostgres.getMemberById(payload.projectId, payload.memberId))
        .rejects
        .toThrow(new NotFoundError('Member Not Found'));
    });

    it('should not throw not found error when member exist', async () => {
      // Arrange
      const payload = {
        projectId: 'project-123',
        memberId: 'user-234',
      };

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'username-234' });
      await ProjectsTableTestHelper.addProject({});
      await MembersTableTestHelper.addMember({});

      const memberRepositoryPostgres = new MemberRepositoryPostgres({ pool });

      // Action
      const member = await memberRepositoryPostgres.getMemberById(payload.projectId, payload.memberId);

      // Assert
      expect(member).toStrictEqual({
        project_id: payload.projectId,
        user_id: payload.memberId,
        role: 'member',
      });
    });
  });

  describe('deleteMemberById', () => {
    it('should throw not found error when member not exist', async () => {
      // Arrange
      const payload = {
        projectId: 'project-123',
        memberId: 'user-345',
      };

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'username-234' });
      await ProjectsTableTestHelper.addProject({});
      await MembersTableTestHelper.addMember({});

      const memberRepositoryPostgres = new MemberRepositoryPostgres({ pool });

      // Action & Assert
      await expect(memberRepositoryPostgres.deleteMemberById(payload.projectId, payload.memberId))
        .rejects
        .toThrow(new NotFoundError('Member Not Found'));
    });

    it('should delete member from database correctly', async () => {
      // Arrange
      const payload = {
        projectId: 'project-123',
        memberId: 'user-234',
      };

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'username-234' });
      await ProjectsTableTestHelper.addProject({});
      await MembersTableTestHelper.addMember({});

      const memberRepositoryPostgres = new MemberRepositoryPostgres({ pool });

      // Action
      await memberRepositoryPostgres.deleteMemberById(payload.projectId, payload.memberId);

      // Assert
      expect(await MembersTableTestHelper.findMemberById(payload.projectId, payload.memberId)).toHaveLength(0);
    });
  });
});