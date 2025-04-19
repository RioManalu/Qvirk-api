class AuthenticationController {
  constructor({ 
    loginUserUseCase,
    logoutUserUseCase,
    refreshAuthenticationUseCase,
  }) {
    this._loginUserUseCase = loginUserUseCase;
    this._logoutUserUseCase = logoutUserUseCase;
    this._refreshAuthenticationUseCase = refreshAuthenticationUseCase;
  }

  async postAuthentication(req, res, next) {
    try {
      const authentication = await this._loginUserUseCase.execute(req.body);
      res.status(201).json({
        status: 'success',
        code: 200,
        message: 'login successful',
        data: {
          authentication,
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async putAuthentication(req, res, next) {
    try {
      const accessToken = await this._refreshAuthenticationUseCase.execute(req.body);
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'new accessToken created',
        data: {
          accessToken,
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteAuthentication(req, res, next) {
    try {
      await this._logoutUserUseCase.execute(req.body);
      res.status(204).json({
        status: 'success',
        code: 204,
        message: 'refreshToken deleted',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthenticationController;