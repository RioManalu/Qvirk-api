class DeleteCommentByIdUseCase {
  constructor({ 
    commentRepository,
    memberRepository,
    taskRepository,
    authenticationTokenManager,}) {
    this._commentRepository = commentRepository;
    this._memberRepository = memberRepository;
    this._taskRepository = taskRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(payload) {
    const { id: userId } = await this._authenticationTokenManager.decodePayload(payload.token);
    await this._memberRepository.searchProject(payload.projectId);
    await this._taskRepository.getTaskById(payload.taskId);
    await this._commentRepository.verifyCommentOwner({
      userId,
      commentId: payload.commentId,
    });
    return this._commentRepository.deleteCommentById(payload.commentId);
  }
}

module.exports = DeleteCommentByIdUseCase;

