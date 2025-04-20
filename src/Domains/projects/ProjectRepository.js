class ProjectRepository {
  async addProject(payload) {
    throw new Error('PROJECT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getProjects() {
    throw new Error('PROJECT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getProjectById(id) {
    throw new Error('PROJECT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyProjectOwner(id, owner) {
    throw new Error('PROJECT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async editProjectById(payload) {
    throw new Error('PROJECT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ProjectRepository;