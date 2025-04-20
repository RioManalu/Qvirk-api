class ProjectController {
  constructor({ 
    addProjectUseCase,
    getProjectsUseCase,
    getProjectByIdUseCase,
  }) {
    this._addProjectUseCase = addProjectUseCase;
    this._getProjectsUseCase = getProjectsUseCase;
    this._getProjectByIdUseCase = getProjectByIdUseCase;
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

  async getProjects(req, res, next) {
    const projects = await this._getProjectsUseCase.execute(req.token);
    try {
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Projects retrieved successfully',
        data: {
          projects,
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getProjectById(req, res, next) {
    try {
      const payload = {
        token: req.token,
        projectId: req.params.projectId,
      }

      const project = await this._getProjectByIdUseCase.execute(payload);
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Project retrieved successfully',
        data: {
          project,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProjectController;