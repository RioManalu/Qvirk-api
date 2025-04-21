class MemberController {
  constructor({
    addMemberUseCase,
  }) {
    this._addMemberUseCase = addMemberUseCase;
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
}

module.exports = MemberController;