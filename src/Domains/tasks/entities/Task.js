class Task {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, description, status, priority, due_date, assigneeId } = payload;
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.due_date = due_date;
    this.assigneeId = assigneeId;
  }
  
  _verifyPayload({ title, description, status, priority, due_date, assigneeId }) {
    if(!title) {
      throw new Error('TASK.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if(typeof title !== 'string') {
      throw new Error('TASK.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    // check optional property
    if((description !== undefined && typeof description !== 'string') ||
      (status !== undefined && typeof status !== 'string') ||
      (priority !== undefined && typeof priority !== 'string') ||
      (due_date !== undefined && typeof due_date !== 'string') ||
      (assigneeId !== undefined && typeof assigneeId !== 'string')) {
      throw new Error('TASK.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Task;