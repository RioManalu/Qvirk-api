class AddCommentUseCase {
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
    this._verifyPayload(payload);
    const { id: userId } = await this._authenticationTokenManager.decodePayload(payload.token);
    await this._memberRepository.searchProject(payload.projectId);
    await this._taskRepository.getTaskById(payload.taskId);
    await this._memberRepository.getMemberById(payload.projectId, userId);
    return this._commentRepository.addComment({
      taskId: payload.taskId,
      content: payload.content,
      userId: userId,
    });
  }

  _verifyPayload({ content }) {
    if(!content) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  
    if(typeof content !== 'string') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddCommentUseCase;

