class CommentController {
  constructor({
    addCommentUseCase,
  }) {
    this._addCommentUseCase = addCommentUseCase;
  }

  async postComment(req, res, next) {
    try {
      const payload = {
        token: req.token,
        projectId: req.params.projectId,
        taskId: req.params.taskId,
        content: req.body.content,
      }

      const addedComment = await this._addCommentUseCase.execute(payload);
      res.status(201).json({
        status: 'success',
        code: 201,
        message: 'New Comment Created',
        data: {
          addedComment,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CommentController;