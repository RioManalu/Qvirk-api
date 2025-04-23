class AddedTask {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id,
      title,
      description,
      status,
      priority,
      due_date,
      project_id,
      created_by,
      assignee_id,
      created_at,
      updated_at,
    } = payload;

    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.due_date = due_date;
    this.project_id = project_id;
    this.created_by = created_by;
    this.assignee_id = assignee_id;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  _verifyPayload({ 
    id,
    title,
    description,
    status,
    priority,
    due_date,
    project_id,
    created_by,
    assignee_id,
    created_at,
    updated_at,
   }) {
    if(!id || !title || !status || !priority|| !project_id || !created_by || !created_at || !updated_at) {
      throw new Error('ADDED_TASK.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    // check mandatory property
    if(typeof id !== 'string'||
      typeof title !== 'string'||
      typeof status !== 'string'||
      typeof priority !== 'string'||
      typeof project_id !== 'string'||
      typeof created_by !== 'string'||
      typeof created_at !== 'object'||
      typeof updated_at !== 'object'
    ) {
      throw new Error('ADDED_TASK.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    // check optional property
    if((description !== undefined && description !== null && typeof description !== 'string') ||
      (assignee_id !== undefined && assignee_id !== null && typeof assignee_id !== 'string') ||
      (due_date !== undefined && due_date !== null && typeof due_date !== 'object')) {
      throw new Error('ADDED_TASK.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
   }
}

module.exports = AddedTask;