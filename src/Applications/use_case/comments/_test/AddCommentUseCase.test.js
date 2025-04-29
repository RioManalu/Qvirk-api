const AddCommentUseCase = require('../AddCommentUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const TaskRepository = require('../../../../Domains/tasks/TaskRepository');
const ProjectRepository = require('../../../../Domains/projects/ProjectRepository');
const MemberRepository = require('../../../../Domains/members/MemberRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');

describe('AddCommentUseCase', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const payload = {};
    const addCommentUseCase = new AddCommentUseCase({});
    
    // Action & Assert
    await expect(addCommentUseCase.execute(payload))
      .rejects
      .toThrow('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', async () => {
    // Arrange
    const payload = {
      content: 123,
    };
    const addCommentUseCase = new AddCommentUseCase({});
    
    // Action & Assert
    await expect(addCommentUseCase.execute(payload))
      .rejects
      .toThrow('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating add comment use case correctly', async () => {
    // Arrange
    const payload = {
      token: 'token',
      projectId: 'project-123',
      taskId: 'task-123',
      content: 'comment',
    };

    const date = new Date();
    const mockAddedComment = {
      id: 'comment-123',
      content: 'content',
      task_id: payload.taskId,
      user_id: 'user-123',
      created_at: date,
      updated_at: date,
    };

    // mock needed classes
    const mockTaskRepository = new TaskRepository();
    const mockMemberRepository = new MemberRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockCommentRepository = new CommentRepository();

    // mock needed functions
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'username' }));
    mockMemberRepository.getMemberById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockMemberRepository.searchProject = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockTaskRepository.getTaskById = jest.fn()
    .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    
    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      memberRepository: mockMemberRepository,
      taskRepository: mockTaskRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(payload);

    // Assert
    expect(addedComment).toStrictEqual({
      id: 'comment-123',
      content: 'content',
      task_id: payload.taskId,
      user_id: 'user-123',
      created_at: date,
      updated_at: date,
    });
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.token);
    expect(mockMemberRepository.getMemberById).toHaveBeenCalledWith(payload.projectId, 'user-123');
    expect(mockMemberRepository.searchProject).toHaveBeenCalledWith(payload.projectId);
    expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(payload.taskId);
    expect(mockCommentRepository.addComment).toHaveBeenCalledWith({
      taskId: payload.taskId,
      content: payload.content,
      userId: 'user-123',
    });
  });
});