const MemberRepository = require('../../../../Domains/members/MemberRepository');
const TaskRepository = require('../../../../Domains/tasks/TaskRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');
const ProjectRepository = require('../../../../Domains/projects/ProjectRepository');
const EditTaskByIdUseCase = require('../EditTaskByIdUseCase');

describe('EditTaskByIdUseCase', () => {
  it('should orchestrating edit task by id use case correctly', async () => {
    // Arrange
    const payload = {
      token: 'token',
      projectId: 'project-123',
      taskId: 'task-123',
      title: 'task-title-new',
      status: 'in_progress',
      assigneeId: 'user-234',
    };

    // mock needed classes
    const mockTaskRepository = new TaskRepository();
    const mockProjectRepository = new ProjectRepository();
    const mockMemberRepository = new MemberRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    // mock needed functions
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'username' }));
    mockProjectRepository.verifyProjectOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockMemberRepository.searchProject = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockMemberRepository.getMemberById = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockTaskRepository.editTaskById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        title: payload.title,
        status: payload.status,
        assigne_id: payload.assigneeId,
      }))

    const editTaskByIdUseCase = new EditTaskByIdUseCase({
      taskRepository: mockTaskRepository,
      projectRepository: mockProjectRepository,
      memberRepository: mockMemberRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const task = await editTaskByIdUseCase.execute(payload);

    // Assert
    expect(task).toStrictEqual({
      title: payload.title,
      status: payload.status,
      assigne_id: payload.assigneeId,
    });
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.token);
    expect(mockProjectRepository.verifyProjectOwner).toHaveBeenCalledWith(payload.projectId, 'user-123');
    expect(mockMemberRepository.searchProject).toHaveBeenCalledWith(payload.projectId);
    expect(mockMemberRepository.getMemberById).toHaveBeenCalledWith(payload.projectId, payload.assigneeId);
    expect(mockTaskRepository.editTaskById).toHaveBeenCalledWith({
      taskId: payload.taskId,
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
      due_date: payload.due_date,
      assigneeId: payload.assigneeId,
    });
  });
});