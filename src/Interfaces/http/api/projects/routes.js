const express = require('express');

function projectRoutes({ projectController, getBearerToken }) {
  const router = express.Router();

  router.post('/', getBearerToken, projectController.postProject.bind(projectController));
  router.get('/', getBearerToken, projectController.getProjects.bind(projectController));

  return router;
}

module.exports = projectRoutes;