const express = require('express');

function commentRoutes({ commentController, getBearerToken }) {
  const router = express.Router({ mergeParams: true });

  router.post('/', getBearerToken, commentController.postComment.bind(commentController));

  return router;
}

module.exports = commentRoutes;