const MemberRepository = require('../../../../Domains/members/MemberRepository');
const TaskRepository = require('../../../../Domains/tasks/TaskRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');
const ProjectRepository = require('../../../../Domains/projects/ProjectRepository');
const DeleteTaskByIdUseCase = require('../DeleteTaskByIdUseCase');
const ActivityLogRepository = require('../../../../Domains/activityLogs/ActivityLogRepository');

describe('EditTaskByIdUseCase', () => {
  it('should orchestrating edit task by id use case correctly', async () => {
    // Arrange
    const payload = {
      token: 'token',
      projectId: 'project-123',
      taskId: 'task-123',
    };

    // mock needed classes
    const mockTaskRepository = new TaskRepository();
    const mockProjectRepository = new ProjectRepository();
    const mockMemberRepository = new MemberRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockActivityLogRepository = new ActivityLogRepository();

    // mock needed functions
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'username' }));
    mockProjectRepository.verifyProjectOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockMemberRepository.searchProject = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockTaskRepository.deleteTaskById = jest.fn()
      .mockImplementation(() => Promise.resolve({ title: 'task-title' }));
    mockActivityLogRepository.addLog = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteTaskByIdUseCase = new DeleteTaskByIdUseCase({
      taskRepository: mockTaskRepository,
      projectRepository: mockProjectRepository,
      memberRepository: mockMemberRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      activityLogRepository: mockActivityLogRepository,
    });

    // Action
    await deleteTaskByIdUseCase.execute(payload);

    // Assert
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.token);
    expect(mockProjectRepository.verifyProjectOwner).toHaveBeenCalledWith(payload.projectId, 'user-123');
    expect(mockMemberRepository.searchProject).toHaveBeenCalledWith(payload.projectId);
    expect(mockTaskRepository.deleteTaskById).toHaveBeenCalledWith(payload.taskId);
    expect(mockActivityLogRepository.addLog).toHaveBeenCalledWith({
      action: 'delete task',
      new_value: null,
      taskId: payload.taskId,
      userId: 'user-123',
    });
  });
});