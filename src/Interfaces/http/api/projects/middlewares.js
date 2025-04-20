const AuthorizationError = require('../../../../Commons/Exeptions/AuthorizationError');
const InvariantError = require('../../../../Commons/Exeptions/InvariantError');

function editableProjectFields(req, res, next) {
  const editableFields = ['name', 'description'];
  const uneditableFields = ['id', 'created_by', 'created_at', 'updated_at'];

  // search for something that is not in editable Fields
  const invalidFields = Object.keys(req.body).filter(field => !editableFields.includes(field));
  const notAuthfields = invalidFields.filter(field => uneditableFields.includes(field));

  if(notAuthfields.length > 0) {
    const error = new AuthorizationError('Cannot Edit Field');
    return next(error);
  }else if(invalidFields.length > 0) {
    const error = new InvariantError('Invalid Field');
    return next(error);
  }

  next();
}

module.exports = editableProjectFields;