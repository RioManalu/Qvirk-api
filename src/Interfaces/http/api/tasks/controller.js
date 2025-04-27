class TaskController {
  constructor({
    addTaskUseCase,
    getTasksUseCase,
    getTaskByIdUseCase,
  }) {
    this._addTaskUseCase = addTaskUseCase;
    this._getTasksUseCase = getTasksUseCase;
    this._getTaskByIdUseCase = getTaskByIdUseCase;
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

  async getTaskById(req, res, next) {
    try {
      const payload = {
        token: req.token,
        projectId: req.params.projectId,
        taskId: req.params.taskId,
      };
      const task = await this._getTaskByIdUseCase.execute(payload);

      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Task Retrieved Successfully',
        data: {
          task,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController;