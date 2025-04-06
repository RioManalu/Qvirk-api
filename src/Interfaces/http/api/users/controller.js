class UserController {
  constructor({ addUserUseCase }) {
    this._addUserUseCase = addUserUseCase;
  }

  async postUser(req, res, next) {
    try {
      const payload = req.body;
      const adddedUser = await this._addUserUseCase.execute(payload);
      res.send(JSON.stringify({
        status: 'success',
        code: 201,
        data: {
          adddedUser,
        }
      }));
      console.log('oke user controller', res.statusCode);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;