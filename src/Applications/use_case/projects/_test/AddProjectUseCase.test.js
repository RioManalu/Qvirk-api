const ProjectRepository = require('../../../../Domains/projects/ProjectRepository');
const UserRepository = require('../../../../Domains/users/UserRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');
const AddProjectUseCase = require('../AddProjectUseCase');
const Project = require('../../../../Domains/projects/entities/Project');
const AddedProject = require('../../../../Domains/projects/entities/AddedProject');

describe('AddProjectUseCase', () => {
  it('should orchestrating add project use case correctly', async () => {
    // Arrange
    const payload = {
      name: 'project-name',
      description: 'project-description',
      created_by: 'token',
    };

    const mockAddedProject = new AddedProject({
      id: 'project-123',
      name: 'project-name',
      created_by: 'user-123',
    });

    // mock needed classes
    const mockProjectRepository = new ProjectRepository();
    const mockUserRepository = new UserRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    // mock needed functions
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'username' }));
    mockUserRepository.verifyUserAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockProjectRepository.addProject = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedProject));


    const addProjectUseCase = new AddProjectUseCase({
      projectRepository: mockProjectRepository,
      userRepository: mockUserRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const addedProject = await addProjectUseCase.execute(payload);

    // Assert
    expect(addedProject).toStrictEqual(new AddedProject({
      id: mockAddedProject.id,
      name: payload.name,
      created_by: mockAddedProject.created_by,
    }));
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.created_by);
    expect(mockUserRepository.verifyUserAccess).toHaveBeenCalledWith('user-123', 'username');
    expect(mockProjectRepository.addProject).toHaveBeenCalledWith(new Project({
      name: payload.name,
      description: payload.description,
      created_by: 'user-123',
    }));
  });
});