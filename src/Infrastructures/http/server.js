const bodyParser = require('body-parser');
const AuthenticationError = require('../../Commons/Exeptions/AuthenticationError');
const AuthorizationError = require('../../Commons/Exeptions/AuthorizationError');
const InvariantError = require('../../Commons/Exeptions/InvariantError');
const NotFoundError = require('../../Commons/Exeptions/NotFoundError');
const ClientError = require('../../Commons/Exeptions/ClientError');


module.exports = (app, container) => {
  // middleware dasar
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // load routes dari container
  const userRoutes = container.resolve('userRoutes');
  const errorHandler = container.resolve('errorHandler');
  

  // routes
  app.use('/api/users', userRoutes);

  // error handling
  app.use(errorHandler);
}