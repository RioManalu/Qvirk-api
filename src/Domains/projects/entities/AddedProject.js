class AddedProject {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, name, created_by } = payload;
    this.id = id;
    this.name = name;
    this.created_by = created_by;
  }

  _verifyPayload({ id, name, created_by }) {
    if(!id || !name || !created_by) {
      throw new Error('ADDED_PROJECT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if(typeof id !== 'string' || typeof name !== 'string' || typeof created_by !== 'string') {
      throw new Error('ADDED_PROJECT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddedProject;