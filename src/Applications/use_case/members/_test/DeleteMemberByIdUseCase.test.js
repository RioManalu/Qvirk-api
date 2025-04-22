const DeleteMemberByIdUseCase = require('../DeleteMemberByIdUseCase');
const MemberRepository = require('../../../../Domains/members/MemberRepository');
const ProjectRepository = require('../../../../Domains/projects/ProjectRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');

describe('DeleteMemberUseCase', () => {
  it('should orchestrating delete member use case correctly', async () => {
    // Arrange
    const payload = {
      token: 'token',
      projectId: 'project-123',
      userId: 'user-234',
    };

    // mock needed classes
    const mockMemberRepository = new MemberRepository();
    const mockProjectRepository = new ProjectRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    // mock needed functions
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'username' }));
    mockProjectRepository.verifyProjectOwner = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockMemberRepository.deleteMemberById = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteMemberUseCase = new DeleteMemberByIdUseCase({
      memberRepository: mockMemberRepository,
      projectRepository: mockProjectRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    await deleteMemberUseCase.execute(payload);

    // Assert
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.token);
    expect(mockProjectRepository.verifyProjectOwner).toHaveBeenCalledWith(payload.projectId, 'user-123');
    expect(mockMemberRepository.deleteMemberById).toHaveBeenCalledWith(payload.projectId, payload.userId);
  });
});