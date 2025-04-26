const TaskRepository = require('../../../../Domains/tasks/TaskRepository');
const GetTasksUseCase = require('../GetTasksUseCase');
const MemberRepository = require('../../../../Domains/members/MemberRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');

describe('GetTasksUseCase', () => {
  it('should orchestrating get tasks use case correctly', async () => {
    // Arrange
    const payload = {
      token: 'token',
      projectId: 'project-123',
      status: 'todo',
      priority: 'low',
    };

    const date = new Date();
    const mockTasks = [
      {
        id: 'task-123',
        title: 'task-title',
        description: 'task-description',
        status: payload.status,
        priority: payload.priority,
        due_date: null,
        project_id: payload.projectId,
        created_by: 'user-123',
        assignee_id: 'user-234',
        created_at: date,
        updated_at: date,
      },
    ]

    // mock needed classes
    const mockTaskRepository = new TaskRepository();
    const mockMemberRepository = new MemberRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    // mock needed functions
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'username' }));
    mockMemberRepository.getMemberById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockTaskRepository.getTasks = jest.fn()
      .mockImplementation(() => Promise.resolve(mockTasks));

    const getTasksUseCase = new GetTasksUseCase({
      taskRepository: mockTaskRepository,
      memberRepository: mockMemberRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const tasks = await getTasksUseCase.execute(payload);

    // Assert
    expect(tasks).toStrictEqual([
      {
        id: 'task-123',
        title: 'task-title',
        description: 'task-description',
        status: payload.status,
        priority: payload.priority,
        due_date: null,
        project_id: payload.projectId,
        created_by: 'user-123',
        assignee_id: 'user-234',
        created_at: new Date(date),
        updated_at: new Date(date),
      },
    ]);
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.token);
    expect(mockMemberRepository.getMemberById).toHaveBeenCalledWith('user-123');
    expect(mockTaskRepository.getTasks).toHaveBeenCalledWith({
      projectId: payload.projectId,
      status: payload.status,
      priority: payload.priority,
      userId: 'user-123',
    });
  });
});