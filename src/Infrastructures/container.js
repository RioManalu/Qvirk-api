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
const ProjectRepositoryPostgres = require('./repository/ProjectRepositoryPostgres');


// use case
const AddUserUseCase = require('../Applications/use_case/users/AddUserUseCase');
const LoginUserUseCase = require('../Applications/use_case/users/LoginUserUseCase');
const LogoutUserUseCase = require('../Applications/use_case/users/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/authentications/RefreshAuthenticationUseCase');
const AddProjectUseCase = require('../Applications/use_case/projects/AddProjectUseCase');
const GetProjectsUseCase = require('../Applications/use_case/projects/GetProjectsUseCase');
const GetProjectByIdUseCase = require('../Applications/use_case/projects/GetProjectByIdUseCase');


// Controller
const UserController = require('../Interfaces/http/api/users/controller');
const AuthenticationController = require('../Interfaces/http/api/authentications/controller');
const ProjectController = require('../Interfaces/http/api/projects/controller');


// Routes
const userRoutes = require('../Interfaces/http/api/users/routes');
const authenticationRoutes = require('../Interfaces/http/api/authentications/routes');
const projectRoutes = require('../Interfaces/http/api/projects/routes');


// Middlewares
const errorHandler = require('./http/shared/errorHandler');
const getBearerToken = require('./http/shared/authMiddleware');



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
  projectRepository: asClass(ProjectRepositoryPostgres),
});


// Middlewares
container.register({
  errorHandler: asValue(errorHandler),
  getBearerToken: asValue(getBearerToken),
});


// Use Cases
container.register({
  addUserUseCase: asClass(AddUserUseCase),
  loginUserUseCase: asClass(LoginUserUseCase),
  logoutUserUseCase: asClass(LogoutUserUseCase),
  refreshAuthenticationUseCase: asClass(RefreshAuthenticationUseCase),
  addProjectUseCase: asClass(AddProjectUseCase),
  getProjectsUseCase: asClass(GetProjectsUseCase),
  getProjectByIdUseCase: asClass(GetProjectByIdUseCase),
});


// Controllers
container.register({
  userController: asClass(UserController),
  authenticationController: asClass(AuthenticationController),
  projectController: asClass(ProjectController),
});


// Routes
container.register({
  userRoutes: asFunction(userRoutes),
  authenticationRoutes: asFunction(authenticationRoutes),
  projectRoutes: asFunction(projectRoutes),
});


module.exports = container;