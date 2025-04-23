const MemberRepository = require('../MemberRepository');

describe('MemberRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const memberRepository = new MemberRepository();

    // Action & Assert
    await expect(memberRepository.searchProject('')).rejects.toThrow('MEMBER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(memberRepository.addMember('')).rejects.toThrow('MEMBER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(memberRepository.getMembers('')).rejects.toThrow('MEMBER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(memberRepository.getMemberById('')).rejects.toThrow('MEMBER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(memberRepository.deleteMemberById('')).rejects.toThrow('MEMBER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});