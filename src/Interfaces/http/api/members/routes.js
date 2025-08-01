const express = require('express');

function memberRoutes({
  memberController,
  getBearerToken,
}) {
  const router = express.Router({ mergeParams: true });

  router.post('/', getBearerToken, memberController.postMember.bind(memberController));
  router.get('/', getBearerToken, memberController.getMembers.bind(memberController));
  router.delete('/:userId', getBearerToken, memberController.deleteMemberById.bind(memberController));

  return router;
}

module.exports = memberRoutes;