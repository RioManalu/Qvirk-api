const CommentRepository = require('../CommentRepository');

describe('ProjectRepository', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentRepository = new CommentRepository();

    // Action & Assert
    await expect(commentRepository.addComment('')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.getComments('')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.editCommentById('')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.deleteCommentById('')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.verifyCommentOwner('')).rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});