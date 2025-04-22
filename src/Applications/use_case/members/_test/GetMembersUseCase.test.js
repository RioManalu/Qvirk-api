const GetMembersUseCase = require('../GetMembersUseCase');
const MemberRepository = require('../../../../Domains/members/MemberRepository');
const AuthenticationTokenManager = require('../../../security/AuthenticationTokenManger');

describe('GetMembersUseCase', () => {
  it('should orchestrating get members use case correctly', async () => {
    // Arrange
    const payload = {
      token: 'token',
      projectId: 'project-123',
    };
    const mockMembers = [
      {
        project_id: 'project-123',
        user_id: 'user-123',
        role: 'member',
      },
    ];

    // mock needed classes
    const mockMemberRepository = new MemberRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();

    // mock needed functions
    mockAuthenticationTokenManager.decodePayload = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123', username: 'username' }));
    mockMemberRepository.searchProject = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockMemberRepository.getMembers = jest.fn()
      .mockImplementation(() => Promise.resolve(mockMembers));

    const getMemberUseCase = new GetMembersUseCase({
      memberRepository: mockMemberRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
    });

    // Action
    const members = await getMemberUseCase.execute(payload);

    // Assert
    expect(members).toStrictEqual([{
      project_id: mockMembers[0].project_id,
      user_id: mockMembers[0].user_id,
      role: mockMembers[0].role,
    }]);
    expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(payload.token);
    expect(mockMemberRepository.searchProject).toHaveBeenCalledWith(payload.projectId);
    expect(mockMemberRepository.getMembers).toHaveBeenCalledWith(payload.projectId);
  });
});