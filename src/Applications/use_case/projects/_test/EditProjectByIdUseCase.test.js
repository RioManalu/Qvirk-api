const EditProjectUseCase = require('../EditProjectByIdUseCase');
const ProjectRepository = require('../../../../Domains/projects/ProjectRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');

describe('EditProjectUseCase', () => {
  it('should throw error when payload not meet data type specification', async () => {
    // Arrange
        const payload = {
      projectId: 'project-123',
      token: 'token',
      name: 123,
      description: {},
    };

    const editProjectUseCase = new EditProjectUseCase({});

    // Action & Assert
    await expect(editProjectUseCase.execute(payload))
      .rejects
      .toThrow('EDIT_PROJECT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  })

  it('should orchestrating edit project use case correctly', async () => {
    // Arrange
    const payload = {
      projectId: 'project-123',
      token: 'token',
      name: 'project-name',
      description: 'project-description',
    };

    // mock needed classes
    const mockProjectRepository = new ProjectRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    // mock needed function
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'username'}));
    mockProjectRepository.verifyProjectOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockProjectRepository.editProjectById = jest.fn()
      .mockImplementation(() => Promise.resolve({
        name: 'New Project Name',
        description: 'New Project Description',
        updated_at: new Date(),
      }));

    const editProjectUseCase = new EditProjectUseCase({
      projectRepository: mockProjectRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const changes = await editProjectUseCase.execute(payload);

    // Assert
    expect(changes).toStrictEqual({
      name: 'New Project Name',
      description: 'New Project Description',
      updated_at: new Date(changes.updated_at),
    });
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.token);
    expect(mockProjectRepository.verifyProjectOwner).toHaveBeenCalledWith(payload.projectId, 'user-123');
    expect(mockProjectRepository.editProjectById).toHaveBeenCalledWith(payload);
  });
});