const bodyParser = require('body-parser');

module.exports = (app, container) => {
  // middleware dasar
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // load routes dari container
  const userRoutes = container.resolve('userRoutes');
  const authenticationRoutes = container.resolve('authenticationRoutes');
  const errorHandler = container.resolve('errorHandler');
  

  // routes
  app.use('/api/users', userRoutes);
  app.use('/api/authentications', authenticationRoutes);

  // error handling
  app.use(errorHandler);
}