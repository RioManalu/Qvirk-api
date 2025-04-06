const express = require('express');

function userRoutes({ userController }) {
  const router = express.Router();

  router.post('/', userController.postUser.bind(userController));

  return router;
}

module.exports = userRoutes;