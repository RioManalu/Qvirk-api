const pool = require('../../../../config/database/postgres/pool');
const TaskRepositoryPostgres = require('../TaskRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/testHelper/UsersTableTestHelper');
const ProjectsTableTestHelper = require('../../../../tests/testHelper/ProjectsTableTestHelper');
const MembersTableTestHelper = require('../../../../tests/testHelper/MembersTableTestHelper');
const TasksTableTestHelper = require('../../../../tests/testHelper/TasksTableTestHelper');
const AddedTask = require('../../../Domains/tasks/entities/AddedTask');

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

  afterAll(async () => {
    await pool.end();
  });

  describe('addTask function', () => {
    it('should persist add task to database', async () => {
      // Arrange
      const payload = {
        title: 'task-title',
        projectId: 'project-123',
        created_by: 'user-123',
      };

      await UsersTableTestHelper.addUser({});
      await ProjectsTableTestHelper.addProject({});

      const idGenerator = () => 123;
      const taskRepositoryPostgres = new TaskRepositoryPostgres({ pool, idGenerator });

      // Action
      const addedTask = await taskRepositoryPostgres.addTask(payload);

      // Assert
      expect(await TasksTableTestHelper.findTaskById(addedTask.id)).toHaveLength(1);
    });

    it('should return added task correctly', async () => {
      // Arrange
      const payload = {
        title: 'task-title',
        projectId: 'project-123',
        created_by: 'user-123',
      };

      await UsersTableTestHelper.addUser({});
      await ProjectsTableTestHelper.addProject({});

      const idGenerator = () => 123;
      const taskRepositoryPostgres = new TaskRepositoryPostgres({ pool, idGenerator });

      // Action
      const addedTask = await taskRepositoryPostgres.addTask(payload);

      // Assert
      expect(addedTask).toEqual(new AddedTask({
        id: 'task-123',
        title: payload.title,
        description: null,
        status: 'todo',
        priority: 'low',
        due_date: null,
        project_id: payload.projectId,
        created_by: payload.created_by,
        assignee_id: null,
        created_at: new Date(addedTask.created_at),
        updated_at: new Date(addedTask.updated_at),
      }));
    });

    it('should return added task with optional correctly', async () => {
      // Arrange
      const payload = {
        title: 'task-title',
        description: 'description',
        status: 'todo',
        priority: 'low',
        due_date: new Date(),
        projectId: 'project-123',
        assigneeId: 'user-234',
        created_by: 'user-123',
      };

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'username-234' });
      await ProjectsTableTestHelper.addProject({});
      await MembersTableTestHelper.addMember({});

      const idGenerator = () => 123;
      const taskRepositoryPostgres = new TaskRepositoryPostgres({ pool, idGenerator });

      // Action
      const addedTask = await taskRepositoryPostgres.addTask(payload);

      // Assert
      expect(addedTask).toEqual(new AddedTask({
        id: 'task-123',
        title: payload.title,
        description: payload.description,
        status: payload.status,
        priority: payload.priority,
        due_date: new Date(addedTask.due_date),
        project_id: payload.projectId,
        created_by: payload.created_by,
        assignee_id: payload.assigneeId,
        created_at: new Date(addedTask.created_at),
        updated_at: new Date(addedTask.updated_at),
      }));
    });
  });
});