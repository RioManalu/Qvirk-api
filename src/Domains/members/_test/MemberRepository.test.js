const MemberRepository = require('../MemberRepository');

describe('MemberRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const memberRepository = new MemberRepository();

    // Action & Assert
    await expect(memberRepository.addMember('')).rejects.toThrow('MEMBER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});