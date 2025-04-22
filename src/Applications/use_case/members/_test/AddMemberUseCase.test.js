const AddMemberUseCase = require('../AddMemberUseCase');
const MemberRepository = require('../../../../Domains/members/MemberRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');
const Member = require('../../../../Domains/members/entities/Member');
const ProjectRepository = require('../../../../Domains/projects/ProjectRepository');

describe('AddMemberUseCase', () => {
  it('should orchestrating add member use case correctly', async () => {
    // Arrange
    const payload = {
      token: 'token',
      projectId: 'project-123',
      userId: 'user-234',
      role: 'member',
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
    mockMemberRepository.addMember = jest.fn()
      .mockImplementation(() => Promise.resolve({
        project_id: payload.projectId,
        user_id: 'user-234',
        role: payload.role,
      }));

    const addMemberUseCase = new AddMemberUseCase({
      memberRepository: mockMemberRepository,
      projectRepository: mockProjectRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const addedMember = await addMemberUseCase.execute(payload);

    // Assert
    expect(addedMember).toStrictEqual({
      project_id: payload.projectId,
      user_id: 'user-234',
      role: payload.role,
    });
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.token);
    expect(mockProjectRepository.verifyProjectOwner).toHaveBeenCalledWith(payload.projectId, 'user-123');
    expect(mockMemberRepository.addMember).toHaveBeenCalledWith({
      projectId: payload.projectId,
      role: 'member',
      userId: 'user-234'
    });
  });
});