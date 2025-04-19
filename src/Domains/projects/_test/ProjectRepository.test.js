const ProjectRepository = require('../ProjectRepository');

describe('ProjectRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const projectRepository = new ProjectRepository();

    // Action & Assert
    await expect(projectRepository.addProject('')).rejects.toThrow('PROJECT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});