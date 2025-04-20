const GetProjectByIdUseCase = require('../GetProjectByIdUseCase');
const ProjectRepository = require('../../../../Domains/projects/ProjectRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');

describe('getProjectById', () => {
  it('should orchestrating get project by id use case correctly', async () => {
    // Arrange
    const payload = {
      token: 'token',
      projectId: 'project-123',
    };
    const date = new Date();
    const mockProject = {
      name: 'project-name',
      desctiption: 'project-description',
      owner: 'username',
      created_at: date,
      upadted_at: date,
    }

    // mock needed classes
    const mockProjectRepository = new ProjectRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    // mock needed functions
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'username' }));
    mockProjectRepository.verifyProjectOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockProjectRepository.getProjectById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockProject));

    const getProjectByIdUseCase = new GetProjectByIdUseCase({
      projectRepository: mockProjectRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const project = await getProjectByIdUseCase.execute(payload);
    
    // Assert
    expect(project).toStrictEqual({
      name: 'project-name',
      desctiption: 'project-description',
      owner: 'username',
      // check if date received is date type
      created_at: new Date(date),
      upadted_at: new Date(date),
    });
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.token);
    expect(mockProjectRepository.verifyProjectOwner).toHaveBeenCalledWith(payload.projectId, 'user-123');
    expect(mockProjectRepository.getProjectById).toHaveBeenCalledWith(payload.projectId);
  });
});