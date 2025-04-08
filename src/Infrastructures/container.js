/* istanbul ignore file */

const { createContainer, asClass, asFunction, asValue } = require('awilix');

// external agency
const { nanoid } = require('nanoid');;
const bcrypt = require('bcrypt');
const pool = require('../../config/database/postgres/pool');
const jwt = require('jsonwebtoken');


// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const JwtTokenManager = require('./security/JwtTokenManager');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');


// use case
const AddUserUseCase = require('../Applications/use_case/users/AddUserUseCase');
const LoginUserUseCase = require('../Applications/use_case/users/LoginUserUseCase');
const LogoutUserUseCase = require('../Applications/use_case/users/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/authentications/RefreshAuthenticationUseCase');


// Controller
const UserController = require('../Interfaces/http/api/users/controller');
const AuthenticationController = require('../Interfaces/http/api/authentications/controller');


// Routes
const userRoutes = require('../Interfaces/http/api/users/routes');
const authenticationRoutes = require('../Interfaces/http/api/authentications/routes');


// Middlewares
const errorHandler = require('./http/shared/errorHandler');



const container = createContainer();

// External agency
container.register({
  bcrypt: asValue(bcrypt),
  idGenerator: asValue(nanoid),
  pool: asValue(pool),
  jwt: asValue(jwt),
});


// Repositories
container.register({
  userRepository: asClass(UserRepositoryPostgres),
  passwordHash: asClass(BcryptPasswordHash),
  authenticationTokenManager: asClass(JwtTokenManager),
  authenticationRepository: asClass(AuthenticationRepositoryPostgres),
});


// Middlewares
container.register({
  errorHandler: asValue(errorHandler),
});


// Use Cases
container.register({
  addUserUseCase: asClass(AddUserUseCase),
  loginUserUseCase: asClass(LoginUserUseCase),
  logoutUserUseCase: asClass(LogoutUserUseCase),
  refreshAuthenticationUseCase: asClass(RefreshAuthenticationUseCase),
});


// Controllers
container.register({
  userController: asClass(UserController),
  authenticationController: asClass(AuthenticationController),
});


// Routes
container.register({
  userRoutes: asFunction(userRoutes),
  authenticationRoutes: asFunction(authenticationRoutes),
});


module.exports = container;