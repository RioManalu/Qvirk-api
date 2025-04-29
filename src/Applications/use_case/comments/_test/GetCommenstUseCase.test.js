const GetCommentsUseCase = require('../GetCommentsUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');
const TaskRepository = require('../../../../Domains/tasks/TaskRepository');
const ProjectRepository = require('../../../../Domains/projects/ProjectRepository');
const MemberRepository = require('../../../../Domains/members/MemberRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');

describe('AddCommentUseCase', () => {
  it('should orchestrating add comment use case correctly', async () => {
    // Arrange
    const payload = {
      token: 'token',
      projectId: 'project-123',
      taskId: 'task-123',
    };

    const mockComments = [
      {
        id: 'comment-123',
        content: 'content',
        task_id: payload.taskId,
        username: 'username',
      }
    ];

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
    mockMemberRepository.getMemberById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.getComments = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));

    
    const getCommentsUseCase = new GetCommentsUseCase({
      commentRepository: mockCommentRepository,
      memberRepository: mockMemberRepository,
      taskRepository: mockTaskRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const comments = await getCommentsUseCase.execute(payload);

    // Assert
    expect(comments).toStrictEqual([
      {
        id: 'comment-123',
        content: 'content',
        task_id: payload.taskId,
        username: 'username',
      }
    ]);
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.token);
    expect(mockMemberRepository.searchProject).toHaveBeenCalledWith(payload.projectId);
    expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(payload.taskId);
    expect(mockMemberRepository.getMemberById).toHaveBeenCalledWith(payload.projectId, 'user-123');
    expect(mockCommentRepository.getComments).toHaveBeenCalledWith(payload.taskId);
  });
});