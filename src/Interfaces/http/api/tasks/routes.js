const express = require('express');

function taskRoutes({ getBearerToken, taskController }) {
  const router = express.Router({ mergeParams: true });

  router.post('/', getBearerToken, taskController.postTask.bind(taskController));
  router.get('/', getBearerToken, taskController.getTasks.bind(taskController));
  router.get('/:taskId', getBearerToken, taskController.getTaskById.bind(taskController));

  return router;
}

module.exports = taskRoutes;