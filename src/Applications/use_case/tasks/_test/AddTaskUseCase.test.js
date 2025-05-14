const AddTaskUseCase = require('../AddTaskUseCase');
const TaskRepository = require('../../../../Domains/tasks/TaskRepository');
const ProjectRepository = require('../../../../Domains/projects/ProjectRepository');
const MemberRepository = require('../../../../Domains/members/MemberRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');
const AddedTask = require('../../../../Domains/tasks/entities/AddedTask');
const ActivityLogRepository = require('../../../../Domains/activityLogs/ActivityLogRepository');

describe('AddTaskUseCase', () => {
  it('should orchestrating add task use case correctly', async () => {
    // Arrange
    const payload = {
      token: 'token',
      title: 'task-title',
      description: 'description',
      status: 'todo',
      projectId: 'project-123',
      assigneeId: 'user-234',
    };

    const date = new Date();
    const mockAddedTask = new AddedTask({
      id: 'task-123',
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: 'low',
      due_date: null,
      project_id: payload.projectId,
      created_by: 'user-123',
      assignee_id: payload.assigneeId,
      created_at: date,
      updated_at: date,
    })

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
    mockMemberRepository.getMemberById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockTaskRepository.addTask = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedTask));
    mockActivityLogRepository.addLog = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addTaskUseCase = new AddTaskUseCase({
      taskRepository: mockTaskRepository,
      projectRepository: mockProjectRepository,
      memberRepository: mockMemberRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      activityLogRepository: mockActivityLogRepository,
    });

    // Action
    const addedTask = await addTaskUseCase.execute(payload);

    // Assert
    expect(addedTask).toStrictEqual(new AddedTask({
      id: mockAddedTask.id,
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: mockAddedTask.priority,
      due_date: null,
      project_id: payload.projectId,
      created_by: mockAddedTask.created_by,
      assignee_id: mockAddedTask.assignee_id,
      created_at: new Date(addedTask.created_at),
      updated_at: new Date(addedTask.updated_at),
    }));
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.token);
    expect(mockProjectRepository.verifyProjectOwner).toHaveBeenCalledWith(payload.projectId, 'user-123');
    expect(mockMemberRepository.getMemberById).toHaveBeenCalledWith(payload.projectId, payload.assigneeId);
    expect(mockTaskRepository.addTask).toHaveBeenCalledWith({
      title: payload.title,
      description: payload.description,
      status: payload.status,
      projectId: payload.projectId,
      assigneeId: payload.assigneeId,
      created_by: 'user-123',
    });
    expect(mockActivityLogRepository.addLog).toHaveBeenCalledWith({
      action: 'add task',
      new_value: payload.title,
      taskId: mockAddedTask.id,
      userId: 'user-123',
    });
  });
});