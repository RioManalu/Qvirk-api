class ProjectController {
  constructor({ 
    addProjectUseCase
  }) {
    this._addProjectUseCase = addProjectUseCase;
  }

  async postProject(req, res, next) {
    try {
      const token = req.token;
      const payload = {
        ...req.body,
        created_by: token,
      }
      const addedProject = await this._addProjectUseCase.execute(payload);
      res.status(201).json({
        status: 'success',
        code: 201,
        message: 'new project created',
        data: {
          addedProject,
        }
      });
    } catch (error) {
      next(error)
    }
  }
}

module.exports = ProjectController;