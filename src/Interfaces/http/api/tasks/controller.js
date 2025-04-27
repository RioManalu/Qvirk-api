class TaskController {
  constructor({
    addTaskUseCase,
    getTasksUseCase,
    getTaskByIdUseCase,
    editTaskByIdUseCase,
    deleteTaskByIdUseCase,
  }) {
    this._addTaskUseCase = addTaskUseCase;
    this._getTasksUseCase = getTasksUseCase;
    this._getTaskByIdUseCase = getTaskByIdUseCase;
    this._editTaskByIdUseCase = editTaskByIdUseCase;
    this._deleteTaskByIdUseCase = deleteTaskByIdUseCase;
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

  async putTaskById(req, res, next) {
    try {
      const payload = {
        token: req.token,
        taskId: req.params.taskId,
        projectId: req.params.projectId,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        due_date: req.body.due_date,
        assigneeId: req.body.assigneeId,
      };
      const changes = await this._editTaskByIdUseCase.execute(payload);

      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Task Updated Successfully',
        data: {
          changes,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTaskById(req, res, next) {
    try {
      const payload = {
        token: req.token,
        projectId: req.params.projectId,
        taskId: req.params.taskId,
      };
      await this._deleteTaskByIdUseCase.execute(payload);

      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TaskController;