const GetProjectsUseCase = require('../GetProjectsUseCase');
const ProjectRepository = require('../../../../Domains/projects/ProjectRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');

describe('getProjectUseCase', () => {
  it('should orchestrating get project use case correctly', async () => {
    // Arrange
    const payload = 'token';

    // mock needed classes
    const mockProjectRepository = new ProjectRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    // mock needed functions
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'username' }));
    mockProjectRepository.getProjects = jest.fn()
      .mockImplementation(() => Promise.resolve([{
        name: 'project-A',
        description: 'description project-A',
        owner: 'username',
      }]));

    const getProjectsUseCase = new GetProjectsUseCase({
      projectRepository: mockProjectRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const projects = await getProjectsUseCase.execute(payload);

    // Assert
    expect(projects).toEqual([{
      name: 'project-A',
      description: 'description project-A',
      owner: 'username',
    }]);
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload);
    expect(mockProjectRepository.getProjects).toHaveBeenCalledWith('user-123');
  });
});