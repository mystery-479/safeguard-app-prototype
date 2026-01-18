// ==================== NOTIFICATION SERVICE MODULE ====================
// Handles app notifications and reminders

class NotificationServiceClass {
  constructor() {
    this.scheduledReminders = new Map();
  }
  
  /**
   * Request notification permission from browser
   * @returns {Promise<string>} Permission status
   */
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('⚠️ Notifications not supported');
      return 'denied';
    }
    
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      console.log(`🔔 Notification permission: ${permission}`);
      return permission;
    }
    
    return Notification.permission;
  }
  
  /**
   * Send immediate notification
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   * @param {object} options - Additional options
   */
  sendNotification(title, body, options = {}) {
    if (Notification.permission !== 'granted') {
      console.warn('⚠️ Notification permission not granted');
      return;
    }
    
    const notification = new Notification(title, {
      body: body,
      icon: options.icon || '/app-icon.png',
      badge: '/badge-icon.png',
      vibrate: options.vibrate || [200, 100, 200],
      tag: options.tag || 'safeguard-notification',
      requireInteraction: options.requireInteraction || false
    });
    
    if (options.onClick) {
      notification.onclick = options.onClick;
    }
    
    console.log('🔔 Notification sent:', title);
  }
  
  /**
   * Schedule reminder for a task
   * @param {TodoTask} task - Task to create reminder for
   */
  scheduleReminder(task) {
    if (!task.dueDate) return;
    
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const timeDiff = dueDate - now;
    
    // Schedule if due within 24 hours
    if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) {
      const timeoutId = setTimeout(() => {
        this.sendNotification(
          'Task Reminder',
          `Due soon: ${task.title}`,
          {
            tag: `task-${task.id}`,
            requireInteraction: true,
            vibrate: [300, 200, 300]
          }
        );
        this.scheduledReminders.delete(task.id);
      }, timeDiff);
      
      this.scheduledReminders.set(task.id, timeoutId);
      console.log(`⏰ Reminder scheduled for: ${task.title}`);
    }
  }
  
  /**
   * Cancel scheduled reminder
   * @param {number} taskId - Task ID
   */
  cancelReminder(taskId) {
    const timeoutId = this.scheduledReminders.get(taskId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.scheduledReminders.delete(taskId);
      console.log(`❌ Reminder cancelled for task: ${taskId}`);
    }
  }
  
  /**
   * Send critical emergency notification
   * @param {string} message - Emergency message
   */
  sendEmergencyNotification(message) {
    this.sendNotification(
      '🚨 EMERGENCY ALERT',
      message,
      {
        requireInteraction: true,
        vibrate: [500, 250, 500, 250, 500],
        tag: 'emergency-alert'
      }
    );
  }
}

export const NotificationService = new NotificationServiceClass();