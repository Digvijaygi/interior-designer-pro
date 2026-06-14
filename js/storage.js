/**
 * Interior Studio Pro - Storage Manager
 * Handles saving/loading projects to/from JSON files and localStorage
 */

// ============================================================
// File Storage (JSON Export/Import)
// ============================================================

/**
 * Save project to JSON file
 * @param {Array} furnitureData - Array of furniture objects
 * @param {Object} roomData - Room configuration (type, dimensions, wall color)
 * @param {Object} additionalData - Any extra data to save (camera position, etc.)
 */
export function saveProjectToFile(furnitureData, roomData, additionalData = {}) {
    try {
        const project = {
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            appName: 'Interior Studio Pro',
            room: {
                type: roomData.type || 'living',
                width: roomData.width || 8,
                depth: roomData.depth || 6,
                height: roomData.height || 3,
                wallColor: roomData.wallColor || '#FAF8F4'
            },
            furniture: furnitureData,
            metadata: {
                itemCount: furnitureData.length,
                ...additionalData
            }
        };
        
        const jsonString = JSON.stringify(project, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `interior-project-${formatDateForFilename()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showStorageToast('Project saved successfully! ✓');
        return true;
    } catch (error) {
        console.error('Error saving project:', error);
        showStorageToast('Error saving project', 'error');
        return false;
    }
}

/**
 * Load project from JSON file
 * @param {File} file - The JSON file to load
 * @param {Function} callback - Callback function with (furnitureData, roomData)
 */
export function loadProjectFromFile(file, callback) {
    const reader = new FileReader();
    
    reader.onload = (event) => {
        try {
            const project = JSON.parse(event.target.result);
            
            // Validate project structure
            if (!project.furniture || !project.room) {
                throw new Error('Invalid project file format');
            }
            
            // Extract data
            const furnitureData = project.furniture;
            const roomData = {
                type: project.room.type,
                width: project.room.width,
                depth: project.room.depth,
                height: project.room.height,
                wallColor: project.room.wallColor
            };
            
            showStorageToast(`Loaded ${furnitureData.length} items from ${project.exportDate?.slice(0, 10) || 'project'}`);
            
            if (callback) callback(furnitureData, roomData);
        } catch (error) {
            console.error('Error parsing project file:', error);
            showStorageToast('Error loading project: Invalid file', 'error');
        }
    };
    
    reader.onerror = () => {
        showStorageToast('Error reading file', 'error');
    };
    
    reader.readAsText(file);
}

/**
 * Export project as JSON (download)
 * Alias for saveProjectToFile for clarity
 */
export function exportProjectToJSON(furnitureData, roomData, additionalData = {}) {
    return saveProjectToFile(furnitureData, roomData, additionalData);
}

/**
 * Import project from JSON file (alias)
 */
export function importProjectFromJSON(file, callback) {
    return loadProjectFromFile(file, callback);
}

// ============================================================
// Local Storage
// ============================================================

const STORAGE_KEY = 'interior_studio_pro_project';
const AUTOSAVE_KEY = 'interior_studio_pro_autosave';
const SETTINGS_KEY = 'interior_studio_pro_settings';

/**
 * Save project to localStorage
 * @param {Array} furnitureData - Furniture data
 * @param {Object} roomData - Room configuration
 * @returns {boolean}
 */
export function saveToLocalStorage(furnitureData, roomData) {
    try {
        const project = {
            version: '1.0.0',
            lastSaved: new Date().toISOString(),
            room: roomData,
            furniture: furnitureData
        };
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
        showStorageToast('Project saved to browser storage');
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showStorageToast('Error saving to storage', 'error');
        return false;
    }
}

/**
 * Load project from localStorage
 * @returns {Object|null} Project data or null if not found
 */
export function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) {
            showStorageToast('No saved project found', 'info');
            return null;
        }
        
        const project = JSON.parse(saved);
        showStorageToast(`Loaded project from ${project.lastSaved?.slice(0, 10) || 'storage'}`);
        return project;
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        showStorageToast('Error loading from storage', 'error');
        return null;
    }
}

/**
 * Auto-save current project
 * @param {Array} furnitureData - Furniture data
 * @param {Object} roomData - Room configuration
 */
export function autoSave(furnitureData, roomData) {
    try {
        const autosave = {
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            room: roomData,
            furniture: furnitureData
        };
        
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(autosave));
        // Don't show toast for autosave to avoid spam
        console.log('💾 Autosaved');
    } catch (error) {
        console.error('Error during autosave:', error);
    }
}

/**
 * Load autosave project
 * @returns {Object|null}
 */
export function loadAutosave() {
    try {
        const autosave = localStorage.getItem(AUTOSAVE_KEY);
        if (!autosave) return null;
        return JSON.parse(autosave);
    } catch (error) {
        console.error('Error loading autosave:', error);
        return null;
    }
}

/**
 * Check if autosave exists
 * @returns {boolean}
 */
export function hasAutosave() {
    return localStorage.getItem(AUTOSAVE_KEY) !== null;
}

/**
 * Clear autosave
 */
export function clearAutosave() {
    localStorage.removeItem(AUTOSAVE_KEY);
}

/**
 * Delete saved project from localStorage
 */
export function deleteSavedProject() {
    localStorage.removeItem(STORAGE_KEY);
    showStorageToast('Saved project deleted');
}

// ============================================================
// Settings Storage
// ============================================================

/**
 * Save app settings to localStorage
 * @param {Object} settings - Settings object
 */
export function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

/**
 * Load app settings from localStorage
 * @returns {Object|null}
 */
export function loadSettings() {
    try {
        const settings = localStorage.getItem(SETTINGS_KEY);
        return settings ? JSON.parse(settings) : null;
    } catch (error) {
        console.error('Error loading settings:', error);
        return null;
    }
}

// ============================================================
// Export as Image (Screenshot with metadata)
// ============================================================

/**
 * Export scene as image with project metadata
 * @param {Object} renderer - Three.js renderer
 * @param {Object} scene - Three.js scene
 * @param {Object} camera - Three.js camera
 * @param {Object} projectInfo - Project metadata
 */
export function exportAsImageWithMetadata(renderer, scene, camera, projectInfo = {}) {
    if (!renderer) return false;
    
    renderer.render(scene, camera);
    const dataURL = renderer.domElement.toDataURL('image/png');
    
    // Create a canvas to add metadata text
    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height + 60;
        const ctx = canvas.getContext('2d');
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Add metadata text
        ctx.fillStyle = '#2D2D2D';
        ctx.fillRect(0, img.height, canvas.width, 60);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px "DM Sans", sans-serif';
        ctx.fillText(`Interior Studio Pro - ${projectInfo.roomType || 'Room'}`, 10, img.height + 25);
        ctx.fillText(`${projectInfo.date || new Date().toLocaleDateString()}`, canvas.width - 150, img.height + 25);
        ctx.font = '10px "DM Sans", sans-serif';
        ctx.fillStyle = '#CCCCCC';
        ctx.fillText(`${projectInfo.itemCount || 0} items | ${projectInfo.dimensions || ''}`, 10, img.height + 45);
        
        // Download
        const link = document.createElement('a');
        link.download = `interior-${formatDateForFilename()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        showStorageToast('Screenshot saved with metadata');
    };
    img.src = dataURL;
    
    return true;
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Format date for filename
 * @returns {string}
 */
function formatDateForFilename() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
}

/**
 * Show toast notification for storage actions
 */
function showStorageToast(message, type = 'success') {
    if (window.showToast) {
        window.showToast(message);
    } else {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        } else {
            console.log(`📁 ${message}`);
        }
    }
}

// ============================================================
// Backup & Restore
// ============================================================

/**
 * Create a backup of current project
 * @param {Array} furnitureData - Furniture data
 * @param {Object} roomData - Room data
 */
export function createBackup(furnitureData, roomData) {
    const backup = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        room: roomData,
        furniture: furnitureData
    };
    
    const backups = getBackupList();
    backups.unshift(backup);
    
    // Keep only last 5 backups
    if (backups.length > 5) backups.pop();
    
    localStorage.setItem('interior_studio_pro_backups', JSON.stringify(backups));
    showStorageToast('Backup created');
}

/**
 * Get list of backups
 * @returns {Array}
 */
export function getBackupList() {
    try {
        const backups = localStorage.getItem('interior_studio_pro_backups');
        return backups ? JSON.parse(backups) : [];
    } catch (error) {
        return [];
    }
}

/**
 * Restore from backup
 * @param {number} index - Backup index
 * @returns {Object|null}
 */
export function restoreFromBackup(index) {
    const backups = getBackupList();
    if (backups[index]) {
        return backups[index];
    }
    return null;
}

/**
 * Clear all backups
 */
export function clearBackups() {
    localStorage.removeItem('interior_studio_pro_backups');
    showStorageToast('Backups cleared');
}

// ============================================================
// Export all functions
// ============================================================

export default {
    saveProjectToFile,
    loadProjectFromFile,
    exportProjectToJSON,
    importProjectFromJSON,
    saveToLocalStorage,
    loadFromLocalStorage,
    autoSave,
    loadAutosave,
    hasAutosave,
    clearAutosave,
    deleteSavedProject,
    saveSettings,
    loadSettings,
    exportAsImageWithMetadata,
    createBackup,
    getBackupList,
    restoreFromBackup,
    clearBackups
};

console.log('💾 Storage module loaded');
