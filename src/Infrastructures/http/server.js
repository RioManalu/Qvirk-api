const bodyParser = require('body-parser');

module.exports = (app, container) => {
  // middleware dasar
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // load routes dari container
  const userRoutes = container.resolve('userRoutes');
  const authenticationRoutes = container.resolve('authenticationRoutes');
  const projectRoutes = container.resolve('projectRoutes');
  const memberRoutes = container.resolve('memberRoutes');
  const taskRoutes = container.resolve('taskRoutes');
  const commentRoutes = container.resolve('commentRoutes');
  const activityLogRoutes = container.resolve('activityLogRoutes');
  const errorHandler = container.resolve('errorHandler');
  

  // routes
  app.use('/api/users', userRoutes);
  app.use('/api/authentications', authenticationRoutes);
  app.use('/api/projects/:projectId/members', memberRoutes);
  app.use('/api/projects/:projectId/tasks', taskRoutes);
  app.use('/api/projects/:projectId/tasks/:taskId/comments', commentRoutes);
  app.use('/api/projects/:projectId/tasks/:taskId/activities', activityLogRoutes);
  app.use('/api/projects', projectRoutes);

  // error handling
  app.use(errorHandler);
}