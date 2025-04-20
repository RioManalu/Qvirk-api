const express = require('express');

function projectRoutes({ 
  projectController, 
  getBearerToken, 
  editableProjectFields 
}) {
  const router = express.Router();

  router.post('/', getBearerToken, projectController.postProject.bind(projectController));
  router.get('/', getBearerToken, projectController.getProjects.bind(projectController));
  router.get('/:projectId', getBearerToken, projectController.getProjectById.bind(projectController));
  router.put('/:projectId', getBearerToken, editableProjectFields, projectController.putProjectById.bind(projectController));

  return router;
}

module.exports = projectRoutes;