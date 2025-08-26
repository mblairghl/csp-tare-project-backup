// localStorage Optimization Utilities
// Prevents quota exceeded errors and manages storage efficiently

class LocalStorageOptimizer {
  constructor() {
    this.maxStorageSize = 5 * 1024 * 1024; // 5MB limit (conservative)
    this.compressionEnabled = true;
    this.cleanupThreshold = 0.8; // Clean up when 80% full
  }

  // Get current storage usage
  getStorageUsage() {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }
    return {
      used: totalSize,
      percentage: (totalSize / this.maxStorageSize) * 100,
      remaining: this.maxStorageSize - totalSize
    };
  }

  // Compress data before storing (simple JSON minification)
  compressData(data) {
    if (!this.compressionEnabled) return JSON.stringify(data);
    
    try {
      // Simple compression: remove unnecessary whitespace from JSON
      const jsonString = JSON.stringify(data);
      return jsonString.replace(/\s+/g, ' ').trim();
    } catch (error) {
      console.warn('Data compression failed:', error);
      return JSON.stringify(data);
    }
  }

  // Decompress data after retrieving
  decompressData(compressedData) {
    try {
      return JSON.parse(compressedData);
    } catch (error) {
      console.warn('Data decompression failed:', error);
      return null;
    }
  }

  // Safe get with automatic cleanup if needed
  safeGet(key, defaultValue = null) {
    try {
      // Check storage usage before operation
      const usage = this.getStorageUsage();
      if (usage.percentage > this.cleanupThreshold * 100) {
        this.performCleanup();
      }

      const item = localStorage.getItem(key);
      if (!item) return defaultValue;

      return this.decompressData(item);
    } catch (error) {
      console.warn(`Error reading from localStorage key "${key}":`, error);
      return defaultValue;
    }
  }

  // Safe set with compression and quota management
  safeSet(key, value) {
    try {
      const compressedData = this.compressData(value);
      const dataSize = compressedData.length + key.length;

      // Check if this operation would exceed quota
      const usage = this.getStorageUsage();
      if (usage.used + dataSize > this.maxStorageSize) {
        console.warn('Storage quota would be exceeded, performing cleanup...');
        this.performCleanup();
        
        // Check again after cleanup
        const newUsage = this.getStorageUsage();
        if (newUsage.used + dataSize > this.maxStorageSize) {
          throw new Error('Insufficient storage space even after cleanup');
        }
      }

      localStorage.setItem(key, compressedData);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
      
      if (error.name === 'QuotaExceededError' || error.message.includes('storage space')) {
        // Emergency cleanup
        this.emergencyCleanup();
        
        // Try one more time after emergency cleanup
        try {
          const compressedData = this.compressData(value);
          localStorage.setItem(key, compressedData);
          return true;
        } catch (retryError) {
          console.error('Failed to save even after emergency cleanup:', retryError);
          alert('Browser storage is critically full. Please use the "Emergency Clear" button to continue.');
          return false;
        }
      }
      return false;
    }
  }

  // Perform regular cleanup of old/unnecessary data
  performCleanup() {
    console.log('Performing localStorage cleanup...');
    
    const keysToClean = [];
    
    // Remove old temporary data
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        // Remove old AI results (keep only latest)
        if (key.startsWith('ai_') && key !== 'ai_latest_results') {
          keysToClean.push(key);
        }
        
        // Remove old cached data
        if (key.startsWith('cache_') || key.startsWith('temp_')) {
          keysToClean.push(key);
        }
        
        // Remove duplicate step data (keep only latest format)
        if (key.includes('_backup_') || key.includes('_old_')) {
          keysToClean.push(key);
        }

        // Remove very large individual items that might be corrupted
        try {
          const itemSize = localStorage[key].length;
          if (itemSize > 500000) { // 500KB per item is too large
            console.warn(`Removing oversized localStorage item: ${key} (${itemSize} bytes)`);
            keysToClean.push(key);
          }
        } catch (e) {
          // If we can't even check the size, it's probably corrupted
          keysToClean.push(key);
        }
      }
    }
    
    // Remove identified keys
    keysToClean.forEach(key => {
      try {
        localStorage.removeItem(key);
        console.log(`Cleaned up localStorage key: ${key}`);
      } catch (error) {
        console.warn(`Failed to remove key ${key}:`, error);
      }
    });
    
    console.log(`Cleanup complete. Removed ${keysToClean.length} items.`);
  }

  // Emergency cleanup - more aggressive
  emergencyCleanup() {
    console.warn('Performing EMERGENCY localStorage cleanup...');
    
    const essentialKeys = [
      'step1_personas',
      'step2_marketing_copy',
      'step3_current_lead_sources',
      'step3_expansion_opportunities',
      'project_setup',
      'content_library'
    ];
    
    // Remove everything except essential keys
    const allKeys = Object.keys(localStorage);
    let removedCount = 0;
    
    allKeys.forEach(key => {
      if (!essentialKeys.includes(key)) {
        try {
          localStorage.removeItem(key);
          removedCount++;
        } catch (error) {
          console.warn(`Failed to remove key ${key}:`, error);
        }
      }
    });
    
    console.warn(`Emergency cleanup complete. Removed ${removedCount} items.`);
  }

  // Get storage statistics
  getStorageStats() {
    const usage = this.getStorageUsage();
    const keyCount = Object.keys(localStorage).length;
    
    return {
      usage,
      keyCount,
      averageKeySize: keyCount > 0 ? Math.round(usage.used / keyCount) : 0,
      needsCleanup: usage.percentage > this.cleanupThreshold * 100
    };
  }

  // Monitor storage and warn user
  monitorStorage() {
    const stats = this.getStorageStats();
    
    if (stats.needsCleanup) {
      console.warn('localStorage is getting full, cleanup recommended');
      
      if (stats.usage.percentage > 90) {
        console.error('localStorage is critically full!');
        return {
          status: 'critical',
          message: 'Storage is critically full. Emergency cleanup needed.',
          stats
        };
      } else if (stats.usage.percentage > 80) {
        return {
          status: 'warning',
          message: 'Storage is getting full. Cleanup recommended.',
          stats
        };
      }
    }
    
    return {
      status: 'ok',
      message: 'Storage usage is normal.',
      stats
    };
  }

  // Optimized storage functions for Step 3
  getStep3Data() {
    return {
      currentLeadSources: this.safeGet('step3_current_lead_sources', []),
      expansionOpportunities: this.safeGet('step3_expansion_opportunities', []),
      highlevelSetup: this.safeGet('step3_highlevel_setup', null)
    };
  }

  setStep3Data(dataType, value) {
    const key = `step3_${dataType}`;
    return this.safeSet(key, value);
  }

  // Cleanup Step 3 specific data if needed
  cleanupStep3Data() {
    const step3Keys = Object.keys(localStorage).filter(key => key.startsWith('step3_'));
    
    // Keep only essential Step 3 data
    const essentialStep3Keys = [
      'step3_current_lead_sources',
      'step3_expansion_opportunities',
      'step3_highlevel_setup'
    ];

    step3Keys.forEach(key => {
      if (!essentialStep3Keys.includes(key)) {
        try {
          localStorage.removeItem(key);
          console.log(`Cleaned up Step 3 key: ${key}`);
        } catch (error) {
          console.warn(`Failed to remove Step 3 key ${key}:`, error);
        }
      }
    });
  }
}

// Export singleton instance
const storageOptimizer = new LocalStorageOptimizer();
export default storageOptimizer;

