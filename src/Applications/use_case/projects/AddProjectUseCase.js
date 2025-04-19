const Project = require("../../../Domains/projects/entities/Project");

class AddProjectUseCase {
  constructor({ projectRepository, userRepository, authenticationTokenManager }) {
    this._projectRepository = projectRepository;
    this._userRepository = userRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(payload) {
    const project = new Project(payload);
    const { id, username } = await this._authenticationTokenManager.decodePayload(project.created_by);
    await this._userRepository.verifyUserAccess(id, username);
    return this._projectRepository.addProject({
      name: payload.name,
      description: payload.description,
      created_by: id,
    });
  }
}

module.exports = AddProjectUseCase;