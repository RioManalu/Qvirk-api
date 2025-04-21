const DeleteProjectByIdUseCase = require('../DeleteProjectByIdUseCase');
const ProjectRepository = require('../../../../Domains/projects/ProjectRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');

describe('DeleteProjectUseCase', () => {
  it('should orchastrating delete project use case correctly', async () => {
    // Arrange
    const payload = {
      token: 'token',
      projectId: 'project-123',
    };

    // mock needed classes
    const mockProjectRepository = new ProjectRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    // mock needed functions
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'username' }));
    mockProjectRepository.verifyProjectOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockProjectRepository.deleteProjectById = jest.fn()
      .mockImplementation(() => Promise.resolve())

    const deleteProjectByIdUseCase = new DeleteProjectByIdUseCase({
      projectRepository: mockProjectRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    await deleteProjectByIdUseCase.execute(payload);

    // Assert
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.token);
    expect(mockProjectRepository.verifyProjectOwner).toHaveBeenCalledWith(payload.projectId, 'user-123');
    expect(mockProjectRepository.deleteProjectById).toHaveBeenCalledWith(payload.projectId);
  });
});