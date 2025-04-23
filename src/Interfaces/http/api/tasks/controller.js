class TaskController {
  constructor({
    addTaskUseCase,
  }) {
    this._addTaskUseCase = addTaskUseCase;
  }

  async postTask(req, res, next) {
    try {
      const payload = {
        token: req.token,
        projectId: req.params.projectId,
        ...req.body,
      };
  
      const addedTask = await this._addTaskUseCase.execute(payload);
      res.status(201).json({
        status: 'success',
        code: 201,
        message: 'New Task Created',
        data: {
          addedTask,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController;