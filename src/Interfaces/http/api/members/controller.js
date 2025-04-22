class MemberController {
  constructor({
    addMemberUseCase,
    getMembersUseCase,
  }) {
    this._addMemberUseCase = addMemberUseCase;
    this._getMembersUseCase = getMembersUseCase;
  }

  async postMember(req, res, next) {
    try {
      const payload = {
        token: req.token,
        projectId: req.body.projectId,
        role: req.body.role,
      };
  
      const addedMember = await this._addMemberUseCase.execute(payload);
      res.status(201).json({
        status: 'success',
        code: 201,
        message: 'New Member Created',
        data: {
          addedMember,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getMembers(req, res, next) {
    try {
      const payload = {
        token: req.token,
        projectId: req.params.projectId,
      };
      const members = await this._getMembersUseCase.execute(payload);
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Members Retrieved Successfully',
        data: {
          members,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MemberController;