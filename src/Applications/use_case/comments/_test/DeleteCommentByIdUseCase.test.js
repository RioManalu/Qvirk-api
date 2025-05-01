const DeleteCommentByIdUseCase = require('../DeleteCommentByIdUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const TaskRepository = require('../../../../Domains/tasks/TaskRepository');
const MemberRepository = require('../../../../Domains/members/MemberRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');

describe('DeleteCommentByIdUseCase', () => {
  it('should orchestrating delete comment by id use case correctly', async () => {
    // Arrange
    const payload = {
      token: 'token',
      projectId: 'project-123',
      taskId: 'task-123',
      commentId: 'comment-123',
    };

    // mock needed classes
    const mockTaskRepository = new TaskRepository();
    const mockMemberRepository = new MemberRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockCommentRepository = new CommentRepository();

    // mock needed functions
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'username' }));
    mockMemberRepository.searchProject = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockTaskRepository.getTaskById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentByIdUseCase = new DeleteCommentByIdUseCase({
      commentRepository: mockCommentRepository,
      memberRepository: mockMemberRepository,
      taskRepository: mockTaskRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    await deleteCommentByIdUseCase.execute(payload);

    // Assert
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.token);
    expect(mockMemberRepository.searchProject).toHaveBeenCalledWith(payload.projectId);
    expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(payload.taskId);
    expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith({
      userId: 'user-123',
      commentId: payload.commentId,
    });
    expect(mockCommentRepository.deleteCommentById).toHaveBeenCalledWith(payload.commentId);
  });
});