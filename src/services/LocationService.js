// ==================== LOCATION SERVICE MODULE ====================
// Handles GPS and location-related functionality

import { StorageService } from './StorageService.js';

class LocationServiceClass {
  constructor() {
    this.watchId = null;
    this.lastKnownLocation = null;
  }
  
  /**
   * Get current GPS position
   * @returns {Promise<object>} Location object with lat, lng, accuracy
   */
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported by browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            timestamp: new Date().toISOString()
          };
          
          this.lastKnownLocation = location;
          StorageService.save(StorageService.KEYS.USER_LOCATION, location);
          
          console.log('📍 Location obtained:', location);
          resolve(location);
        },
        (error) => {
          console.error('❌ Location error:', error.message);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }
  
  /**
   * Start watching position continuously
   * @param {function} callback - Called with each position update
   * @returns {number|null} Watch ID
   */
  watchPosition(callback) {
    if (!navigator.geolocation) {
      console.error('❌ Geolocation not available');
      return null;
    }
    
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        
        this.lastKnownLocation = location;
        callback(location);
      },
      (error) => {
        console.error('❌ Watch position error:', error.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000
      }
    );
    
    console.log('👀 Started watching position');
    return this.watchId;
  }
  
  /**
   * Stop watching position
   */
  stopWatching() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
      console.log('🛑 Stopped watching position');
    }
  }
  
  /**
   * Get Google Maps URL for coordinates
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {string} Maps URL
   */
  getMapUrl(lat, lng) {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }
  
  /**
   * Get last known location from cache
   * @returns {object|null} Cached location
   */
  getLastKnownLocation() {
    if (this.lastKnownLocation) {
      return this.lastKnownLocation;
    }
    return StorageService.load(StorageService.KEYS.USER_LOCATION);
  }
  
  /**
   * Calculate distance between two coordinates (Haversine formula)
   * @param {number} lat1 - First latitude
   * @param {number} lon1 - First longitude
   * @param {number} lat2 - Second latitude
   * @param {number} lon2 - Second longitude
   * @returns {number} Distance in kilometers
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }
}

export const LocationService = new LocationServiceClass();