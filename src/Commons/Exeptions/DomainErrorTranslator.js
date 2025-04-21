const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat login karena properti yang dibutuhkan tidak ada'),
  'LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat login karena tipe data tidak sesuai'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('tidak dapat refresh authentication karena properti yang dibutuhkan tidak ada'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak daspat refresh authentication karena tipe data tidak sesuai'),
  'PROJECT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat project baru karena properti yang dibutuhkan tidak ada'),
  'PROJECT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat project baru karena tipe data tidak sesuai'),
  'EDIT_PROJECT.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat mengedit project karena tipe data tidak sesuai'),
  'MEMBER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat member baru karena properti yang dibutuhkan tidak ada'),
  'MEMBER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat member baru karena tipe data tidak sesuai'),
};

module.exports = DomainErrorTranslator;
