const ActivityLogRepository = require('../../../../Domains/activityLogs/ActivityLogRepository');
const TaskRepository = require('../../../../Domains/tasks/TaskRepository');
const GetActivityLogsUseCase = require('../GetActivityLogsUseCase');
const MemberRepository = require('../../../../Domains/members/MemberRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');

describe('GetActivityLogsUseCase', () => {
  it('should orchestrating get activity logs use case correctly', async () => {
    // Arrange
    const payload = {
      token: 'token',
      projectId: 'project-123',
      taskId: 'task-123',
    };

    const date = new Date();
    const mockLogs = [
      {
        id: 'activityLog-123',
        action: 'add task',
        new_value: 'task-title',
        task_id: payload.taskId,
        user_id: 'user-234',
        created_at: date,
      },
    ];

    // mock needed classes
    const mockTaskRepository = new TaskRepository();
    const mockMemberRepository = new MemberRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockActivityLogRepository = new ActivityLogRepository();

    // mock needed functions
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'username' }));
    mockMemberRepository.searchProject = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockMemberRepository.getMemberById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockTaskRepository.getTaskById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockActivityLogRepository.getLogs = jest.fn()
      .mockImplementation(() => Promise.resolve(mockLogs));

    const getActivityLogUseCase = new GetActivityLogsUseCase({
      taskRepository: mockTaskRepository,
      memberRepository: mockMemberRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      activityLogRepository: mockActivityLogRepository,
    });

    // Action
    const logs = await getActivityLogUseCase.execute(payload);

    // Assert
    expect(logs).toStrictEqual([
      {
        id: 'activityLog-123',
        action: 'add task',
        new_value: 'task-title',
        task_id: 'task-123',
        user_id: 'user-234',
        created_at: new Date(logs[0].created_at),
      },
    ]);
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.token);
    expect(mockMemberRepository.searchProject).toHaveBeenCalledWith(payload.projectId);
    expect(mockMemberRepository.getMemberById).toHaveBeenCalledWith(payload.projectId,'user-123');
    expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(payload.taskId);
    expect(mockActivityLogRepository.getLogs).toHaveBeenCalledWith();
  });
});