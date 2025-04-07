const ClientError = require("../../../Commons/Exeptions/ClientError");
const DomainErrorTranslator = require("../../../Commons/Exeptions/DomainErrorTranslator");

function errorHandler(err, req, res, next) {

  const translatedError = DomainErrorTranslator.translate(err);
  
  if(translatedError instanceof ClientError) {
    res.status(translatedError.statusCode).json({
      error: {
        status: 'fail',
        code: translatedError.statusCode,
        message: translatedError.message,
        ...(process.env.NODE_ENV === 'development' && { stack: translatedError.stack }),
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