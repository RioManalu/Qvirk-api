const pool = require('../../../../config/database/postgres/pool');
const ActivityLogRepositoryPostgres = require('../ActivityLogRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/testHelper/UsersTableTestHelper');
const ProjectsTableTestHelper = require('../../../../tests/testHelper/ProjectsTableTestHelper');
const MembersTableTestHelper = require('../../../../tests/testHelper/MembersTableTestHelper');
const TasksTableTestHelper = require('../../../../tests/testHelper/TasksTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/testHelper/CommentsTableTestHelper');
const ActivityLogsTableTestHelper = require('../../../../tests/testHelper/ActivityLogsTableTestHelper');
const NotFoundError = require('../../../Commons/Exeptions/NotFoundError');

describe('TaskRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });
  
  afterEach(async () => {
    await ProjectsTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await MembersTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await TasksTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await ActivityLogsTableTestHelper.cleanTable();
  });


  afterAll(async () => {
    await pool.end();
  });

  describe('addLog function', () => {
    it('should persist add log to database', async () => {
      // Arrange
      const payload = {
        action: 'add task',
        new_value: 'task-title',
        taskId: 'task-123',
        userId: 'user-234',
      };

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'username2' });
      await ProjectsTableTestHelper.addProject({});
      await MembersTableTestHelper.addMember({});
      await TasksTableTestHelper.addTask({});

      const idGenerator = () => 123;
      const activityLogRepositoryPostgres = new ActivityLogRepositoryPostgres({ pool, idGenerator });

      // Action
      const addedLog = await activityLogRepositoryPostgres.addLog(payload);

      // Assert
      expect(await ActivityLogsTableTestHelper.findLogById(addedLog.id));
    });

    it('should return added log correctly', async () => {
      // Arrange
      const payload = {
        action: 'add task',
        new_value: 'task-title',
        taskId: 'task-123',
        userId: 'user-234',
      };

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'username2' });
      await ProjectsTableTestHelper.addProject({});
      await MembersTableTestHelper.addMember({});
      await TasksTableTestHelper.addTask({});

      const idGenerator = () => 123;
      const activityLogRepositoryPostgres = new ActivityLogRepositoryPostgres({ pool, idGenerator });

      // Action
      const addedLog = await activityLogRepositoryPostgres.addLog(payload);

      // Assert
      expect(addedLog).toEqual({
        id: 'activityLog-123',
        action: 'add task',
        new_value: 'task-title',
        task_id: payload.taskId,
        user_id: payload.userId,
        created_at: new Date(addedLog.created_at),
      });
    });
  });

  describe('getLog function', () => {
    it('should return log object correctly', async () => {
      // Arrange
      const logId = 'activityLog-123';

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'username2' });
      await ProjectsTableTestHelper.addProject({});
      await MembersTableTestHelper.addMember({});
      await TasksTableTestHelper.addTask({});
      await ActivityLogsTableTestHelper.addLog({});

      const activityLogRepositoryPostgres = new ActivityLogRepositoryPostgres({ pool });

      // Action
      const log = await activityLogRepositoryPostgres.getLogs(logId);

      // Assert
      expect(log).toEqual([{
        id: 'activityLog-123',
        action: 'add task',
        new_value: 'task-title',
        task_id: 'task-123',
        user_id: 'user-234',
        created_at: new Date(log[0].created_at),
      }]);
    });
  });
});