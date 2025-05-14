class ActivityLogController {
  constructor({
    getActivityLogsUseCase,
  }) {
    this._getActivityLogsUseCase = getActivityLogsUseCase;
  }

  async getLogs(req, res, next) {
    try {
      const payload = {
        token: req.token,
        projectId: req.params.projectId,
        taskId: req.params.taskId,
      }

      const logs = await this._getActivityLogsUseCase.execute(payload);
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Logs Retrieved Successfully',
        data: {
          logs,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ActivityLogController;