/* istanbul ignore file */

const { createContainer, asClass, asFunction, asValue } = require('awilix');

// external agency
const { nanoid } = require('nanoid');;
const bcrypt = require('bcrypt');
const pool = require('../../config/database/postgres/pool');


// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');


// use case
const AddUserUseCase = require('../Applications/use_case/users/AddUserUseCase');


// Controller
const UserController = require('../Interfaces/http/api/users/controller');


// Routes
const userRoutes = require('../Interfaces/http/api/users/routes');


// Middlewares
const errorHandler = require('./http/shared/errorHandler');



const container = createContainer();

// External agency
container.register({
  bcrypt: asValue(bcrypt),
  idGenerator: asValue(nanoid),
  pool: asValue(pool),
})


// Repositories
container.register({
  userRepository: asClass(UserRepositoryPostgres),
  passwordHash: asClass(BcryptPasswordHash),
});


// Middlewares
container.register({
  errorHandler: asValue(errorHandler),
})


// Use Cases
container.register({
  addUserUseCase: asClass(AddUserUseCase),
});


// Controllers
container.register({
  userController: asClass(UserController),
});


// Routes
container.register({
  userRoutes: asFunction(userRoutes),
});


module.exports = container;