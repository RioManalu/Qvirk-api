const ProjectRepository = require('../ProjectRepository');

describe('ProjectRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const projectRepository = new ProjectRepository();

    // Action & Assert
    await expect(projectRepository.addProject('')).rejects.toThrow('PROJECT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(projectRepository.getProjects('')).rejects.toThrow('PROJECT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(projectRepository.getProjectById('')).rejects.toThrow('PROJECT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(projectRepository.verifyProjectOwner('')).rejects.toThrow('PROJECT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(projectRepository.editProjectById('')).rejects.toThrow('PROJECT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});