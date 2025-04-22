class MemberRepository {
  async searchProject(projectId) {
    throw new Error('MEMBER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  
  async addMember(payload) {
    throw new Error('MEMBER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
  
  async getMembers(projectId) {
    throw new Error('MEMBER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteMemberById(projectId, memberId) {
    throw new Error('MEMBER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = MemberRepository;