class ActivityLogRepository {
  async addLog(payload) {
    throw new Error('ACTIVITY_LOGS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getLogs() {
    throw new Error('ACTIVITY_LOGS_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = ActivityLogRepository;