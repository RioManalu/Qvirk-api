const express = require('express');

function authenticationRoutes({ authenticationController }) {
  const router = express.Router();

  router.post('/', authenticationController.postAuthentication.bind(authenticationController));
  router.put('/', authenticationController.putAuthentication.bind(authenticationController));
  router.delete('/', authenticationController.deleteAuthentication.bind(authenticationController));

  return router;
}

module.exports = authenticationRoutes;