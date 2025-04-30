class CommentController {
  constructor({
    addCommentUseCase,
    getCommentsUseCase,
    editCommentByIdUseCase,
  }) {
    this._addCommentUseCase = addCommentUseCase;
    this._getCommentsUseCase = getCommentsUseCase;
    this._editCommentByIdUseCase = editCommentByIdUseCase;
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

  async getComments(req, res, next) {
    try {
      const payload = {
        token: req.token,
        projectId: req.params.projectId,
        taskId: req.params.taskId,
      }

      const comments = await this._getCommentsUseCase.execute(payload);
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Comments Retrieved Successfully',
        data: {
          comments,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async putCommentById(req, res, next) {
    try {
      const payload = {
        token: req.token,
        projectId: req.params.projectId,
        taskId: req.params.taskId,
        commentId: req.params.commentId,
        content: req.body.content,
      }

      const changes = await this._editCommentByIdUseCase.execute(payload);
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Comment Updated Successfully',
        data: {
          changes,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CommentController;