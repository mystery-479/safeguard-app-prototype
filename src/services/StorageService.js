// ==================== STORAGE SERVICE MODULE ====================
// Handles all data persistence operations

class StorageServiceClass {
  constructor() {
    this.KEYS = {
      CONTACTS: 'safeguard_emergency_contacts',
      LOST_ITEMS: 'safeguard_lost_items',
      TODOS: 'safeguard_todo_tasks',
      USER_LOCATION: 'safeguard_user_location',
      EMERGENCY_SESSION: 'safeguard_emergency_session',
      USER_PREFERENCES: 'safeguard_user_preferences'
    };
  }
  
  /**
   * Save data to localStorage
   * @param {string} key - Storage key
   * @param {any} data - Data to store
   * @returns {boolean} Success status
   */
  save(key, data) {
    try {
      const jsonData = JSON.stringify(data);
      localStorage.setItem(key, jsonData);
      console.log(`✅ Saved to ${key}`);
      return true;
    } catch (error) {
      console.error('❌ Storage save error:', error);
      return false;
    }
  }
  
  /**
   * Load data from localStorage
   * @param {string} key - Storage key
   * @returns {any|null} Retrieved data or null
   */
  load(key) {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Storage load error:', error);
      return null;
    }
  }
  
  /**
   * Remove specific key from storage
   * @param {string} key - Storage key
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      console.log(`🗑️ Removed ${key}`);
      return true;
    } catch (error) {
      console.error('❌ Storage remove error:', error);
      return false;
    }
  }
  
  /**
   * Clear all application data
   */
  clearAll() {
    try {
      Object.values(this.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('🗑️ All data cleared');
      return true;
    } catch (error) {
      console.error('❌ Storage clear error:', error);
      return false;
    }
  }
  
  /**
   * Export all data as JSON
   * @returns {object} All stored data
   */
  exportData() {
    const exportObj = {};
    Object.entries(this.KEYS).forEach(([name, key]) => {
      exportObj[name] = this.load(key);
    });
    return exportObj;
  }
  
  /**
   * Import data from JSON
   * @param {object} data - Data to import
   */
  importData(data) {
    try {
      Object.entries(data).forEach(([name, value]) => {
        const key = this.KEYS[name];
        if (key && value) {
          this.save(key, value);
        }
      });
      return true;
    } catch (error) {
      console.error('❌ Import error:', error);
      return false;
    }
  }
}

export const StorageService = new StorageServiceClass();