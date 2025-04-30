const express = require('express');

function commentRoutes({ commentController, getBearerToken }) {
  const router = express.Router({ mergeParams: true });

  router.post('/', getBearerToken, commentController.postComment.bind(commentController));
  router.get('/', getBearerToken, commentController.getComments.bind(commentController));
  router.put('/:commentId', getBearerToken, commentController.putCommentById.bind(commentController));

  return router;
}

module.exports = commentRoutes;