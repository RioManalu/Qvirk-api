const ActivityLogRepository = require('../ActivityLogRepository');

describe('ActivityLogRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const activityLogRepository = new ActivityLogRepository();

    await expect(activityLogRepository.addLog('')).rejects.toThrow('ACTIVITY_LOGS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(activityLogRepository.getLogs('')).rejects.toThrow('ACTIVITY_LOGS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});