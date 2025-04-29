const pool = require('../../../../config/database/postgres/pool');
const TaskRepositoryPostgres = require('../TaskRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/testHelper/UsersTableTestHelper');
const ProjectsTableTestHelper = require('../../../../tests/testHelper/ProjectsTableTestHelper');
const MembersTableTestHelper = require('../../../../tests/testHelper/MembersTableTestHelper');
const TasksTableTestHelper = require('../../../../tests/testHelper/TasksTableTestHelper');
const AddedTask = require('../../../Domains/tasks/entities/AddedTask');
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

  describe('getTasks function', () => {
    it('should return tasks object correctly', async () => {
      // Arrange
      const payload = {
        projectId: 'project-123',
        assigneeId: 'user-234',
      };

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'username2' });
      await UsersTableTestHelper.addUser({ id: 'user-345', username: 'username3' });
      await ProjectsTableTestHelper.addProject({});
      await MembersTableTestHelper.addMember({});
      await TasksTableTestHelper.addTask({});
      await TasksTableTestHelper.addTask({ id: 'task-234', description: 'description-2', status: 'in_progress', priority: 'medium' });
      await TasksTableTestHelper.addTask({ id: 'task-345', description: 'description-3', status: 'done', priority: 'high', assignee_id: 'user-345' });

      const taskRepositoryPostgres = new TaskRepositoryPostgres({ pool });

      // Action
      const tasks = await taskRepositoryPostgres.getTasks(payload);

      // Assert
      expect(tasks).toStrictEqual([
        {
          id: 'task-123',
          title: 'task-title',
          description: 'task-description',
          status: 'todo',
          priority: 'low',
          due_date: new Date(tasks[0].due_date),
          project_id: payload.projectId,
          created_by: 'user-123',
          assignee_id: payload.assigneeId,
          created_at: new Date(tasks[0].created_at),
          updated_at: new Date(tasks[0].updated_at)
        },
        {
          id: 'task-234',
          title: 'task-title',
          description: 'description-2',
          status: 'in_progress',
          priority: 'medium',
          due_date: new Date(tasks[1].due_date),
          project_id: payload.projectId,
          created_by: 'user-123',
          assignee_id: payload.assigneeId,
          created_at: new Date(tasks[1].created_at),
          updated_at: new Date(tasks[1].updated_at)
        }
      ])
    });
  });

  describe('getTaskById function', () => {
    it('should throw not found error when task not found', async () => {
      // Arrange
      const payload = {
        taskId: 'task-234',
      };

      // Action & Assert
      await expect(() => new TaskRepositoryPostgres({ pool }).getTaskById(payload.taskId))
        .rejects
        .toThrow(new NotFoundError('Task Not Found'));
    });

    it('should return task object correctly when task is exist', async () => {
      // Arrange
      const payload = {
        taskId: 'task-123',
      };

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'username2' });
      await ProjectsTableTestHelper.addProject({});
      await MembersTableTestHelper.addMember({});
      await TasksTableTestHelper.addTask({});

      const taskRepositoryPostgres = new TaskRepositoryPostgres({ pool });

      // Action
      const task = await taskRepositoryPostgres.getTaskById(payload.taskId);

      // Assert
      expect(task).toStrictEqual({
        id: payload.taskId,
        title: 'task-title',
        description: 'task-description',
        status: 'todo',
        priority: 'low',
        due_date: new Date(task.due_date),
        project_id: 'project-123',
        created_by: 'user-123',
        assignee_id: 'user-234',
        created_at: new Date(task.created_at),
        updated_at: new Date(task.updated_at),
      });
    });
  });

  describe('editTaskById function', () => {
    it('should throw not found error when task not found', async () => {
      // Arrange
      const payload = {
        taskId: 'task-234',
        title: 'new-title',
        description: 'new-description',
        status: 'in_progress',
        priority: 'high',
        due_date: new Date(),
        assigneeId: 'user-345',
      };

      // Action & Assert
      await expect(() => new TaskRepositoryPostgres({ pool }).editTaskById(payload))
        .rejects
        .toThrow(new NotFoundError('Task Not Found'));
    });

    it('should return task changes object correctly when task is exist', async () => {
      // Arrange
      const payload = {
        taskId: 'task-123',
        title: 'new-title',
        description: 'new-description',
        status: 'in_progress',
        priority: 'high',
        due_date: new Date(),
        assigneeId: 'user-345',
      };

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'username2' });
      await UsersTableTestHelper.addUser({ id: 'user-345', username: 'username3' });
      await ProjectsTableTestHelper.addProject({});
      await MembersTableTestHelper.addMember({});
      await TasksTableTestHelper.addTask({});

      const taskRepositoryPostgres = new TaskRepositoryPostgres({ pool });

      // Action
      const task = await taskRepositoryPostgres.editTaskById(payload);

      // Assert
      expect(task).toStrictEqual({
        title: payload.title,
        description: payload.description,
        status: payload.status,
        priority: payload.priority,
        due_date: new Date(task.due_date),
        assignee_id: payload.assigneeId,
      });
    });
  });

  describe('deleteTaskById function', () => {
    it('should throw not found error when task not found', async () => {
      // Arrange
      const taskId = 'task-234';

      // Action & Assert
      await expect(() => new TaskRepositoryPostgres({ pool }).deleteTaskById(taskId))
        .rejects
        .toThrow(new NotFoundError('Task Not Found'));
    });

    it('should delete task from database when task is exist', async () => {
      // Arrange
      const taskId = 'task-123';

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'username2' });
      await ProjectsTableTestHelper.addProject({});
      await MembersTableTestHelper.addMember({});
      await TasksTableTestHelper.addTask({});

      const taskRepositoryPostgres = new TaskRepositoryPostgres({ pool });

      // Action
      await taskRepositoryPostgres.deleteTaskById(taskId);

      // Assert
      expect(await TasksTableTestHelper.findTaskById(taskId)).toHaveLength(0);
    });
  });
});