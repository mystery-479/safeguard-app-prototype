// ==================== DATA MODELS MODULE ====================
// All data structures for the application

export class EmergencyContact {
  constructor(id, name, phone, relationship, isPrimary = false) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.relationship = relationship;
    this.isPrimary = isPrimary;
    this.createdAt = new Date().toISOString();
  }
}

export class LostItem {
  constructor(id, title, description, category, location, dateReported, status = 'lost') {
    this.id = id;
    this.title = title;
    this.description = description;
    this.category = category;
    this.location = location;
    this.dateReported = dateReported;
    this.status = status; // 'lost', 'found', 'recovered'
    this.createdAt = new Date().toISOString();
  }
}

export class TodoTask {
  constructor(id, title, dueDate, priority, completed = false) {
    this.id = id;
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority; // 'low', 'medium', 'high'
    this.completed = completed;
    this.createdAt = new Date().toISOString();
  }
}

export class EmergencySession {
  constructor(id, startTime, location, contactsAlerted, recordingActive) {
    this.id = id;
    this.startTime = startTime;
    this.location = location;
    this.contactsAlerted = contactsAlerted;
    this.recordingActive = recordingActive;
    this.isActive = true;
    this.events = [];
  }
  
  addEvent(eventType, data) {
    this.events.push({
      type: eventType,
      timestamp: new Date().toISOString(),
      data: data
    });
  }
}