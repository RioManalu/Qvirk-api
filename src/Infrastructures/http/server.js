const bodyParser = require('body-parser');

module.exports = (app, container) => {
  // middleware dasar
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // load routes dari container
  const userRoutes = container.resolve('userRoutes');
  const authenticationRoutes = container.resolve('authenticationRoutes');
  const projectRoutes = container.resolve('projectRoutes');
  const errorHandler = container.resolve('errorHandler');
  

  // routes
  app.use('/api/users', userRoutes);
  app.use('/api/authentications', authenticationRoutes);
  app.use('/api/projects', projectRoutes);

  // error handling
  app.use(errorHandler);
}