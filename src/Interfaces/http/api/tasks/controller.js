class TaskController {
  constructor({
    addTaskUseCase,
    getTasksUseCase,
  }) {
    this._addTaskUseCase = addTaskUseCase;
    this._getTasksUseCase = getTasksUseCase;
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

  async getTasks(req, res, next) {
    try {
      const payload = {
        token: req.token,
        projectId: req.params.projectId,
        status: req.query.status,
        priority: req.query.priority,
      };
      
      const tasks = await this._getTasksUseCase.execute(payload);
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Tasks Retrieved Successfully',
        data: {
          tasks,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController;