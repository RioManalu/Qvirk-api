const express = require('express');

function activityLogRoutes({ activityLogController, getBearerToken }) {
  const router = express.Router({ mergeParams: true });

  router.get('/', getBearerToken, activityLogController.getLogs.bind(activityLogController));

  return router;
}

module.exports = activityLogRoutes;