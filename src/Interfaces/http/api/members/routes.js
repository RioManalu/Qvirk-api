const express = require('express');

function memberRoutes({
  memberController,
  getBearerToken,
}) {
  const router = express.Router();

  router.post('/', getBearerToken, memberController.postMember.bind(memberController));

  return router;
}

module.exports = memberRoutes;