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
const MemberRepositoryPostgres = require('./repository/MemberRepositoryPostgres');
const TaskRepositoryPostgres = require('./repository/TaskRepositoryPostgres');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');
const ActivityLogRepositoryPostgres = require('./repository/ActivityLogRepositoryPostgres');


// use case
const AddUserUseCase = require('../Applications/use_case/users/AddUserUseCase');
const LoginUserUseCase = require('../Applications/use_case/users/LoginUserUseCase');
const LogoutUserUseCase = require('../Applications/use_case/users/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/authentications/RefreshAuthenticationUseCase');
const AddProjectUseCase = require('../Applications/use_case/projects/AddProjectUseCase');
const GetProjectsUseCase = require('../Applications/use_case/projects/GetProjectsUseCase');
const GetProjectByIdUseCase = require('../Applications/use_case/projects/GetProjectByIdUseCase');
const EditProjectUseCase = require('../Applications/use_case/projects/EditProjectByIdUseCase');
const DeleteProjectByIdUseCase = require('../Applications/use_case/projects/DeleteProjectByIdUseCase');
const AddMemberUseCase = require('../Applications/use_case/members/AddMemberUseCase');
const GetMembersUseCase = require('../Applications/use_case/members/GetMembersUseCase');
const DeleteMemberByIdUseCase = require('../Applications/use_case/members/DeleteMemberByIdUseCase');
const AddTaskUseCase = require('../Applications/use_case/tasks/AddTaskUseCase');
const GetTasksUseCase = require('../Applications/use_case/tasks/GetTasksUseCase');
const GetTasByIdUseCase = require('../Applications/use_case/tasks/GetTaskByIdUseCase');
const EditTaskByIdUseCase = require('../Applications/use_case/tasks/EditTaskByIdUseCase');
const DeleteTaskByIdUseCase = require('../Applications/use_case/tasks/DeleteTaskByIdUseCase');
const AddCommentUseCase = require('../Applications/use_case/comments/AddCommentUseCase');
const GetCommentsUseCase = require('../Applications/use_case/comments/GetCommentsUseCase');
const EditCommentByIdUseCase = require('../Applications/use_case/comments/EditCommentByIdUseCase');
const DeleteCommentByIdUseCase = require('../Applications/use_case/comments/DeleteCommentByIdUseCase');
const GetActivityLogsUseCase = require('../Applications/use_case/activityLogs/GetActivityLogsUseCase');


// Controller
const UserController = require('../Interfaces/http/api/users/controller');
const AuthenticationController = require('../Interfaces/http/api/authentications/controller');
const ProjectController = require('../Interfaces/http/api/projects/controller');
const MemberController = require('../Interfaces/http/api/members/controller');
const TaskController = require('../Interfaces/http/api/tasks/controller');
const CommentController = require('../Interfaces/http/api/comments/controller');
const ActivityLogController = require('../Interfaces/http/api/activityLogs/controller');


// Routes
const userRoutes = require('../Interfaces/http/api/users/routes');
const authenticationRoutes = require('../Interfaces/http/api/authentications/routes');
const projectRoutes = require('../Interfaces/http/api/projects/routes');
const memberRoutes = require('../Interfaces/http/api/members/routes');
const taskRoutes = require('../Interfaces/http/api/tasks/routes');
const commentRoutes = require('../Interfaces/http/api/comments/routes');
const activityLogRoutes = require('../Interfaces/http/api/activityLogs/routes');


// Middlewares
const errorHandler = require('./http/shared/errorHandler');
const getBearerToken = require('./http/shared/authMiddleware');
const editableProjectFields = require('../Interfaces/http/api/projects/middlewares');


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
  memberRepository: asClass(MemberRepositoryPostgres),
  taskRepository: asClass(TaskRepositoryPostgres),
  commentRepository: asClass(CommentRepositoryPostgres),
  activityLogRepository: asClass(ActivityLogRepositoryPostgres),
});


// Middlewares
container.register({
  errorHandler: asValue(errorHandler),
  getBearerToken: asValue(getBearerToken),
  editableProjectFields: asValue(editableProjectFields),
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
  editProjectUseCase: asClass(EditProjectUseCase),
  deleteProjectByIdUseCase: asClass(DeleteProjectByIdUseCase),
  addMemberUseCase: asClass(AddMemberUseCase),
  getMembersUseCase: asClass(GetMembersUseCase),
  deleteMemberByIdUseCase: asClass(DeleteMemberByIdUseCase),
  addTaskUseCase: asClass(AddTaskUseCase),
  getTasksUseCase: asClass(GetTasksUseCase),
  getTaskByIdUseCase: asClass(GetTasByIdUseCase),
  editTaskByIdUseCase: asClass(EditTaskByIdUseCase),
  deleteTaskByIdUseCase: asClass(DeleteTaskByIdUseCase),
  addCommentUseCase: asClass(AddCommentUseCase),
  getCommentsUseCase: asClass(GetCommentsUseCase),
  editCommentByIdUseCase: asClass(EditCommentByIdUseCase),
  deleteCommentByIdUseCase: asClass(DeleteCommentByIdUseCase),
  getActivityLogsUseCase: asClass(GetActivityLogsUseCase),
});


// Controllers
container.register({
  userController: asClass(UserController),
  authenticationController: asClass(AuthenticationController),
  projectController: asClass(ProjectController),
  memberController: asClass(MemberController),
  taskController: asClass(TaskController),
  commentController: asClass(CommentController),
  activityLogController: asClass(ActivityLogController),
});


// Routes
container.register({
  userRoutes: asFunction(userRoutes),
  authenticationRoutes: asFunction(authenticationRoutes),
  projectRoutes: asFunction(projectRoutes),
  memberRoutes: asFunction(memberRoutes),
  taskRoutes: asFunction(taskRoutes),
  commentRoutes: asFunction(commentRoutes),
  activityLogRoutes: asFunction(activityLogRoutes),
});


module.exports = container;