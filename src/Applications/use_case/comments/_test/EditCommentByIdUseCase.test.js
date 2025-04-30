const EditCommentByIdUseCase = require('../EditCommentByIdUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const TaskRepository = require('../../../../Domains/tasks/TaskRepository');
const MemberRepository = require('../../../../Domains/members/MemberRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');

describe('EditCommentByIdUseCase', () => {
  it('should throw error when payload not contain needed property', async () => {
    // Arrange
    const payload = {};
    const editCommentByIdUseCase = new EditCommentByIdUseCase({});
    
    // Action & Assert
    await expect(editCommentByIdUseCase.execute(payload))
      .rejects
      .toThrow('EDIT_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', async () => {
    // Arrange
    const payload = {
      content: 123,
    };
    const editCommentByIdUseCase = new EditCommentByIdUseCase({});
    
    // Action & Assert
    await expect(editCommentByIdUseCase.execute(payload))
      .rejects
      .toThrow('EDIT_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating edit comment by id use case correctly', async () => {
    // Arrange
    const payload = {
      token: 'token',
      projectId: 'project-123',
      taskId: 'task-123',
      commentId: 'comment-123',
      content: 'new-comment',
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
    mockCommentRepository.editCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve({ content: 'new-comment' }));

    
    const editCommentByIdUseCase = new EditCommentByIdUseCase({
      commentRepository: mockCommentRepository,
      memberRepository: mockMemberRepository,
      taskRepository: mockTaskRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const changes = await editCommentByIdUseCase.execute(payload);

    // Assert
    expect(changes).toStrictEqual({
      content: payload.content,
    });
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.token);
    expect(mockMemberRepository.getMemberById).toHaveBeenCalledWith(payload.projectId, 'user-123');
    expect(mockMemberRepository.searchProject).toHaveBeenCalledWith(payload.projectId);
    expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(payload.taskId);
    expect(mockCommentRepository.editCommentById).toHaveBeenCalledWith({
      commentId: payload.commentId,
      content: payload.content,
    });
  });
});