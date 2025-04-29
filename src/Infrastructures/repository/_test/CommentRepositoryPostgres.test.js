const pool = require('../../../../config/database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/testHelper/UsersTableTestHelper');
const ProjectsTableTestHelper = require('../../../../tests/testHelper/ProjectsTableTestHelper');
const MembersTableTestHelper = require('../../../../tests/testHelper/MembersTableTestHelper');
const TasksTableTestHelper = require('../../../../tests/testHelper/TasksTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/testHelper/CommentsTableTestHelper');

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

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment to database', async () => {
      // Arrange
      const payload = {
        taskId: 'task-123',
        content: 'content',
        userId: 'user-234',
      };

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'username2' });
      await ProjectsTableTestHelper.addProject({});
      await MembersTableTestHelper.addMember({});
      await TasksTableTestHelper.addTask({});

      const idGenerator = () => 123;
      const commentRepositoryPostgres = new CommentRepositoryPostgres({ pool, idGenerator });

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(payload);

      // Assert
      expect(await CommentsTableTestHelper.findCommentById(addedComment.id));
    });

    it('should return added task correctly', async () => {
      // Arrange
      const payload = {
        taskId: 'task-123',
        content: 'content',
        userId: 'user-234',
      };

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'username2' });
      await ProjectsTableTestHelper.addProject({});
      await MembersTableTestHelper.addMember({});
      await TasksTableTestHelper.addTask({});

      const idGenerator = () => 123;
      const commentRepositoryPostgres = new CommentRepositoryPostgres({ pool, idGenerator });

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(payload);

      // Assert
      expect(addedComment).toEqual({
        id: 'comment-123',
        content: 'content',
        task_id: payload.taskId,
        user_id: payload.userId,
        created_at: new Date(addedComment.created_at),
        updated_at: new Date(addedComment.updated_at),
      });
    });
  });

  describe('getComments function', () => {
    it('should return comments object correctly', async () => {
      // Arrange
      const taskId = 'task-123';

      await UsersTableTestHelper.addUser({});
      await UsersTableTestHelper.addUser({ id: 'user-234', username: 'username2' });
      await ProjectsTableTestHelper.addProject({});
      await MembersTableTestHelper.addMember({});
      await TasksTableTestHelper.addTask({});
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres({ pool });

      // Action
      const comments = await commentRepositoryPostgres.getComments(taskId);

      // Assert
      expect(comments).toEqual([
        {
          id: 'comment-123',
          content: 'content',
          task_id: taskId,
          username: 'username2',
        }
      ]);
    });
  });
});