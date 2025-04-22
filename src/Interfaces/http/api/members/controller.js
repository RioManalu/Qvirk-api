class MemberController {
  constructor({
    addMemberUseCase,
    getMembersUseCase,
    deleteMemberByIdUseCase,
  }) {
    this._addMemberUseCase = addMemberUseCase;
    this._getMembersUseCase = getMembersUseCase;
    this._deleteMemberByIdUseCase = deleteMemberByIdUseCase;
  }

  async postMember(req, res, next) {
    try {
      const payload = {
        token: req.token,
        projectId: req.params.projectId,
        userId: req.body.userId,
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

  async deleteMemberById(req, res, next) {
    try {
      const payload = {
        token: req.token,
        projectId: req.params.projectId,
        userId: req.params.userId,
      };
      await this._deleteMemberByIdUseCase.execute(payload);
      res.status(204).json({});
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MemberController;