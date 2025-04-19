class UserController {
  constructor({ addUserUseCase }) {
    this._addUserUseCase = addUserUseCase;
  }

  async postUser(req, res, next) {
    try {
      const payload = req.body;
      const addedUser = await this._addUserUseCase.execute(payload);
      res.status(201).json({
        status: 'success',
        code: 201,
        message: 'new user created',
        data: {
          addedUser,
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;