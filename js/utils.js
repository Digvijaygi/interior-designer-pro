/**
 * Interior Studio Pro - Utilities
 * Helper functions for toast notifications, ID generation, formatting, etc.
 */

// ============================================================
// Toast Notifications
// ============================================================

let toastTimeout = null;
let toastQueue = [];
let isToastShowing = false;

/**
 * Show a toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duration in ms (default: 2500)
 */
export function showToast(message, type = 'success', duration = 2500) {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.log(`🔔 ${message}`);
        return;
    }
    
    // Set icon based on type
    const icons = {
        success: '✓',
        error: '✗',
        warning: '⚠',
        info: 'ℹ'
    };
    const icon = icons[type] || '✓';
    
    toast.innerHTML = `${icon} ${message}`;
    toast.classList.add('show');
    
    // Add type-specific styling
    toast.style.background = getToastBackground(type);
    
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
        toast.style.background = '';
    }, duration);
}

/**
 * Get background color for toast based on type
 */
function getToastBackground(type) {
    switch (type) {
        case 'error': return '#c0392b';
        case 'warning': return '#e67e22';
        case 'info': return '#3498db';
        default: return '#2D2D2D';
    }
}

/**
 * Show error toast
 * @param {string} message - Error message
 */
export function showErrorToast(message) {
    showToast(message, 'error');
}

/**
 * Show success toast
 * @param {string} message - Success message
 */
export function showSuccessToast(message) {
    showToast(message, 'success');
}

/**
 * Show warning toast
 * @param {string} message - Warning message
 */
export function showWarningToast(message) {
    showToast(message, 'warning');
}

/**
 * Show info toast
 * @param {string} message - Info message
 */
export function showInfoToast(message) {
    showToast(message, 'info');
}

// ============================================================
// ID Generation
// ============================================================

/**
 * Generate a unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a short ID (for furniture items)
 * @returns {string} Short ID
 */
export function generateShortId() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

/**
 * Generate a numeric ID
 * @returns {number} Numeric ID
 */
export function generateNumericId() {
    return Date.now() + Math.floor(Math.random() * 10000);
}

// ============================================================
// Formatting Functions
// ============================================================

/**
 * Format distance in meters
 * @param {number} meters - Distance in meters
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted distance
 */
export function formatDistance(meters, decimals = 2) {
    return `${meters.toFixed(decimals)} m`;
}

/**
 * Format area in square meters
 * @param {number} width - Width in meters
 * @param {number} depth - Depth in meters
 * @returns {string} Formatted area
 */
export function formatArea(width, depth) {
    const area = width * depth;
    return `${area.toFixed(1)} m²`;
}

/**
 * Format date for display
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted date
 */
export function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Format file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format time elapsed
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} Formatted time
 */
export function formatTimeElapsed(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
}

// ============================================================
// Color Utilities
// ============================================================

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color code (e.g., '#FF0000' or 'FF0000')
 * @returns {Object} RGB object {r, g, b}
 */
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Convert RGB to hex
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color code
 */
export function rgbToHex(r, g, b) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Lighten or darken a color
 * @param {string} color - Hex color code
 * @param {number} percent - Percentage to lighten (positive) or darken (negative)
 * @returns {string} New hex color
 */
export function adjustColor(color, percent) {
    const rgb = hexToRgb(color);
    if (!rgb) return color;
    
    const r = Math.min(255, Math.max(0, rgb.r + (rgb.r * percent / 100)));
    const g = Math.min(255, Math.max(0, rgb.g + (rgb.g * percent / 100)));
    const b = Math.min(255, Math.max(0, rgb.b + (rgb.b * percent / 100)));
    
    return rgbToHex(Math.round(r), Math.round(g), Math.round(b));
}

/**
 * Get contrasting text color (black or white)
 * @param {string} hexColor - Background color
 * @returns {string} '#000000' or '#FFFFFF'
 */
export function getContrastColor(hexColor) {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return '#000000';
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
}

// ============================================================
// Debounce & Throttle
// ============================================================

/**
 * Debounce function - limits how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function - ensures function is called at most once per interval
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================================
// DOM Utilities
// ============================================================

/**
 * Safely get element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null}
 */
export function getElement(id) {
    return document.getElementById(id);
}

/**
 * Toggle element visibility
 * @param {string} id - Element ID
 * @param {boolean} visible - Visibility state
 */
export function toggleVisibility(id, visible) {
    const el = getElement(id);
    if (el) {
        el.style.display = visible ? '' : 'none';
    }
}

/**
 * Create a DOM element with classes and attributes
 * @param {string} tag - HTML tag
 * @param {Object} options - Options {class, id, attributes, text, html}
 * @returns {HTMLElement}
 */
export function createElement(tag, options = {}) {
    const el = document.createElement(tag);
    
    if (options.class) el.className = options.class;
    if (options.id) el.id = options.id;
    if (options.text) el.textContent = options.text;
    if (options.html) el.innerHTML = options.html;
    
    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            el.setAttribute(key, value);
        });
    }
    
    return el;
}

// ============================================================
// Math Utilities
// ============================================================

/**
 * Clamp a number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

/**
 * Linear interpolation
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees
 * @returns {number} Radians
 */
export function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * Convert radians to degrees
 * @param {number} radians - Radians
 * @returns {number} Degrees
 */
export function radToDeg(radians) {
    return radians * 180 / Math.PI;
}

/**
 * Random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

// ============================================================
// Array Utilities
// ============================================================

/**
 * Shuffle array (Fisher-Yates)
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array (new array)
 */
export function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Remove duplicates from array
 * @param {Array} array - Array with possible duplicates
 * @returns {Array} Array without duplicates
 */
export function uniqueArray(array) {
    return [...new Set(array)];
}

/**
 * Chunk array into smaller arrays
 * @param {Array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array} Chunked array
 */
export function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

// ============================================================
// Object Utilities
// ============================================================

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean}
 */
export function isEmptyObject(obj) {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * Merge objects recursively
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
export function deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(result[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}

// ============================================================
// URL & Navigation Utilities
// ============================================================

/**
 * Get URL parameter
 * @param {string} name - Parameter name
 * @returns {string|null} Parameter value
 */
export function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/**
 * Set URL parameter without reloading
 * @param {string} name - Parameter name
 * @param {string} value - Parameter value
 */
export function setUrlParameter(name, value) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(name, value);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({}, '', newUrl);
}

// ============================================================
// Device Detection
// ============================================================

/**
 * Check if device is mobile
 * @returns {boolean}
 */
export function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if device is touch-enabled
 * @returns {boolean}
 */
export function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// ============================================================
// Export all utilities
// ============================================================

export default {
    // Toast
    showToast,
    showErrorToast,
    showSuccessToast,
    showWarningToast,
    showInfoToast,
    
    // ID Generation
    generateId,
    generateShortId,
    generateNumericId,
    
    // Formatting
    formatDistance,
    formatArea,
    formatDate,
    formatFileSize,
    formatTimeElapsed,
    
    // Color
    hexToRgb,
    rgbToHex,
    adjustColor,
    getContrastColor,
    
    // Function utilities
    debounce,
    throttle,
    
    // DOM
    getElement,
    toggleVisibility,
    createElement,
    
    // Math
    clamp,
    lerp,
    degToRad,
    radToDeg,
    randomRange,
    
    // Arrays
    shuffleArray,
    uniqueArray,
    chunkArray,
    
    // Objects
    deepClone,
    isEmptyObject,
    deepMerge,
    
    // URL
    getUrlParameter,
    setUrlParameter,
    
    // Device
    isMobile,
    isTouchDevice
};

console.log('🔧 Utils module loaded');
