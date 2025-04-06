const ClientError = require("../../../Commons/Exeptions/ClientError");

function errorHandler(err, req, res, next) {
  
  if(err instanceof ClientError) {
    res.status(err.statusCode).json({
      error: {
        status: 'fail',
        code: err.statusCode,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      }
    });
  }else {
    // console.log('error stack', err.stack);
    res.status(500).json({
      error: {
        status: 500,
        message: 'internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      }
    });
  }
}

module.exports = errorHandler;