// ==================== EMERGENCY SERVICE MODULE ====================
// Core emergency response logic

import { LocationService } from './LocationService.js';
import { StorageService } from './StorageService.js';
import { EmergencySession } from '../models/AppModels.js';

class EmergencyServiceClass {
  constructor() {
    this.activeSession = null;
    this.locationWatchId = null;
    this.recordingInterval = null;
  }
  
  /**
   * Activate emergency mode
   * @param {Array} contacts - Emergency contacts to alert
   * @returns {Promise<object>} Result with success status and session
   */
  async activateEmergency(contacts) {
    try {
      console.log('🚨 Activating emergency mode...');
      
      // Get current location
      const location = await LocationService.getCurrentPosition();
      
      // Create emergency session
      const session = new EmergencySession(
        Date.now(),
        new Date().toISOString(),
        location,
        contacts.map(c => c.id),
        true
      );
      
      this.activeSession = session;
      StorageService.save(StorageService.KEYS.EMERGENCY_SESSION, session);
      
      // Start continuous location tracking
      this.startLocationTracking(session);
      
      // Send alerts to all contacts
      this.sendAlerts(contacts, location);
      
      // Start recording simulation (in real app, use MediaRecorder API)
      this.startRecording(session);
      
      console.log('✅ Emergency mode activated');
      return { success: true, session };
      
    } catch (error) {
      console.error('❌ Emergency activation failed:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Start continuous location tracking
   * @param {EmergencySession} session - Active emergency session
   */
  startLocationTracking(session) {
    this.locationWatchId = LocationService.watchPosition((newLocation) => {
      session.location = newLocation;
      session.addEvent('LOCATION_UPDATE', newLocation);
      StorageService.save(StorageService.KEYS.EMERGENCY_SESSION, session);
      console.log('📍 Location updated:', newLocation);
    });
  }
  
  /**
   * Send emergency alerts to contacts
   * @param {Array} contacts - Contacts to alert
   * @param {object} location - Current location
   */
  sendAlerts(contacts, location) {
    const mapLink = LocationService.getMapUrl(location.latitude, location.longitude);
    const message = `🚨 EMERGENCY ALERT!

I need immediate help. Please check my location:
${mapLink}

This is an automated emergency message from SafeGuard App.

Time: ${new Date().toLocaleString()}
Coordinates: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}
Accuracy: ±${location.accuracy.toFixed(0)}m`;

    contacts.forEach(contact => {
      // In production: Use Twilio API or native SMS
      console.log(`📧 Alert sent to ${contact.name} (${contact.phone})`);
      console.log(`Message: ${message}`);
      
      // Simulate SMS sending
      this.simulateSMS(contact.phone, message);
    });
    
    // Browser notification
    this.sendBrowserNotification(
      'Emergency Activated',
      `Alerts sent to ${contacts.length} contacts`
    );
  }
  
  /**
   * Simulate SMS sending (for demo purposes)
   * In production: Replace with actual SMS API
   */
  simulateSMS(phoneNumber, message) {
    // This is where you'd integrate Twilio, Nexmo, or native SMS
    console.log(`📱 SMS to ${phoneNumber}: ${message}`);
  }
  
  /**
   * Start recording simulation
   * @param {EmergencySession} session - Active session
   */
  startRecording(session) {
    // In production: Use MediaRecorder API for audio/video
    let recordingTime = 0;
    
    this.recordingInterval = setInterval(() => {
      recordingTime += 1;
      session.addEvent('RECORDING_TICK', { duration: recordingTime });
      console.log(`🎥 Recording: ${recordingTime}s`);
    }, 1000);
  }
  
  /**
   * Deactivate emergency mode
   * @returns {object} Result with success status
   */
  deactivateEmergency() {
    console.log('🛑 Deactivating emergency mode...');
    
    // Stop location tracking
    if (this.locationWatchId) {
      LocationService.stopWatching();
      this.locationWatchId = null;
    }
    
    // Stop recording
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
      this.recordingInterval = null;
    }
    
    // Send "I'm safe" message to contacts
    if (this.activeSession) {
      const contacts = StorageService.load(StorageService.KEYS.CONTACTS) || [];
      contacts.forEach(contact => {
        console.log(`✅ "I'm safe" message sent to ${contact.name}`);
      });
    }
    
    // Clear session
    this.activeSession = null;
    StorageService.remove(StorageService.KEYS.EMERGENCY_SESSION);
    
    console.log('✅ Emergency mode deactivated');
    return { success: true };
  }
  
  /**
   * Get active emergency session
   * @returns {EmergencySession|null}
   */
  getActiveSession() {
    if (this.activeSession) {
      return this.activeSession;
    }
    return StorageService.load(StorageService.KEYS.EMERGENCY_SESSION);
  }
  
  /**
   * Send browser notification
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   */
  sendBrowserNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/emergency-icon.png',
        badge: '/badge-icon.png',
        vibrate: [200, 100, 200]
      });
    }
  }
}

export const EmergencyService = new EmergencyServiceClass();