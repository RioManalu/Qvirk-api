class Project {
  constructor(payload) {
    this._verifyPayload(payload);

    const { name, description, created_by } = payload;
    this.name = name;
    this.description = description;
    this.created_by = created_by;
  }

  _verifyPayload({ name, description, created_by }) {
    if(!name || !description || !created_by) {
      throw new Error('PROJECT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if(typeof name !== 'string' || typeof description !== 'string' || typeof created_by !== 'string') {
      throw new Error('PROJECT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Project;