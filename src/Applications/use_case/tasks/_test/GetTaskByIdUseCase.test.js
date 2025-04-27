const MemberRepository = require('../../../../Domains/members/MemberRepository');
const TaskRepository = require('../../../../Domains/tasks/TaskRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');
const GetTaskByIdUseCase = require('../GetTaskByIdUseCase');

describe('GetTaskByIdUseCase', () => {
  it('should orchestrating get task by id use case correctly', async () => {
    // Arrange
    const payload = {
      token: 'token',
      projectId: 'project-123',
      taskId: 'task-123',
    };
    const date = new Date();

    // mock needed classes
    const mockTaskRepository = new TaskRepository();
    const mockMemberRepository = new MemberRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    // mock needed functions
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'username' }));
    mockMemberRepository.getMemberById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockMemberRepository.searchProject = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockTaskRepository.getTaskById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: payload.taskId,
        title: 'task-title',
        description: 'task-description',
        status: 'todo',
        priority: 'low',
        due_date: null,
        project_id: payload.projectId,
        created_by: 'user-123',
        assignee_id: 'user-234',
        created_at: date,
        updated_at: date,
      }))

    const getTaskByIdUseCase = new GetTaskByIdUseCase({
      taskRepository: mockTaskRepository,
      memberRepository: mockMemberRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const task = await getTaskByIdUseCase.execute(payload);

    // Assert
    expect(task).toStrictEqual({
      id: payload.taskId,
      title: 'task-title',
      description: 'task-description',
      status: 'todo',
      priority: 'low',
      due_date: null,
      project_id: payload.projectId,
      created_by: 'user-123',
      assignee_id: 'user-234',
      created_at: new Date(task.created_at),
      updated_at: new Date(task.updated_at),
    });
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.token);
    expect(mockMemberRepository.getMemberById).toHaveBeenCalledWith(payload.projectId, 'user-123');
    expect(mockMemberRepository.searchProject).toHaveBeenCalledWith(payload.projectId);
    expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(payload.taskId);
  });
});