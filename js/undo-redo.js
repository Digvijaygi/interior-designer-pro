/**
 * Interior Studio Pro - Undo/Redo System
 * Manages history stack for Ctrl+Z (undo) and Ctrl+Y (redo) functionality
 */

// ============================================================
// State Variables
// ============================================================

let historyStack = [];
let currentIndex = -1;
let maxHistorySize = 50;
let isUndoRedoInProgress = false;

// ============================================================
// Core History Functions
// ============================================================

/**
 * Save current state to history
 * @param {Array} furnitureData - Current furniture data array
 * @param {Object} sceneRef - Scene reference (for optional additional state)
 * @param {Object} additionalData - Any extra state to save (camera, room settings, etc.)
 */
export function saveStateToHistory(furnitureData, sceneRef = null, additionalData = {}) {
    // Don't save if we're in the middle of undo/redo
    if (isUndoRedoInProgress) return;
    
    // Create deep copy of furniture data
    const stateCopy = {
        furniture: JSON.parse(JSON.stringify(furnitureData)),
        timestamp: Date.now(),
        roomSettings: additionalData.roomSettings || null,
        cameraPosition: additionalData.cameraPosition || null,
        cameraTarget: additionalData.cameraTarget || null
    };
    
    // If we're not at the end of the stack, remove future states
    if (currentIndex < historyStack.length - 1) {
        historyStack = historyStack.slice(0, currentIndex + 1);
    }
    
    // Add new state
    historyStack.push(stateCopy);
    currentIndex = historyStack.length - 1;
    
    // Limit history size
    if (historyStack.length > maxHistorySize) {
        historyStack.shift();
        currentIndex--;
    }
    
    // Update UI indicators
    updateUndoRedoUI();
    
    // Debug log (optional)
    // console.log(`📝 State saved - History size: ${historyStack.length}, Index: ${currentIndex}`);
}

/**
 * Undo the last action
 * @returns {Object|null} Previous state or null if nothing to undo
 */
export function undo() {
    if (!canUndo()) {
        console.log('⏪ Nothing to undo');
        return null;
    }
    
    isUndoRedoInProgress = true;
    currentIndex--;
    const state = historyStack[currentIndex];
    
    // Update UI
    updateUndoRedoUI();
    showUndoRedoToast('undo');
    
    isUndoRedoInProgress = false;
    
    return {
        furniture: state.furniture,
        roomSettings: state.roomSettings,
        cameraPosition: state.cameraPosition,
        cameraTarget: state.cameraTarget
    };
}

/**
 * Redo the last undone action
 * @returns {Object|null} Next state or null if nothing to redo
 */
export function redo() {
    if (!canRedo()) {
        console.log('⏩ Nothing to redo');
        return null;
    }
    
    isUndoRedoInProgress = true;
    currentIndex++;
    const state = historyStack[currentIndex];
    
    // Update UI
    updateUndoRedoUI();
    showUndoRedoToast('redo');
    
    isUndoRedoInProgress = false;
    
    return {
        furniture: state.furniture,
        roomSettings: state.roomSettings,
        cameraPosition: state.cameraPosition,
        cameraTarget: state.cameraTarget
    };
}

/**
 * Check if undo is available
 * @returns {boolean}
 */
export function canUndo() {
    return currentIndex > 0;
}

/**
 * Check if redo is available
 * @returns {boolean}
 */
export function canRedo() {
    return currentIndex < historyStack.length - 1;
}

/**
 * Get current history information
 * @returns {Object}
 */
export function getHistoryInfo() {
    return {
        stackSize: historyStack.length,
        currentIndex: currentIndex,
        canUndo: canUndo(),
        canRedo: canRedo()
    };
}

/**
 * Clear entire history
 */
export function clearHistory() {
    historyStack = [];
    currentIndex = -1;
    updateUndoRedoUI();
    console.log('🗑️ History cleared');
}

/**
 * Get current state (for debugging)
 * @returns {Object|null}
 */
export function getCurrentState() {
    if (currentIndex >= 0 && currentIndex < historyStack.length) {
        return historyStack[currentIndex];
    }
    return null;
}

// ============================================================
// UI Updates
// ============================================================

/**
 * Update undo/redo button states in UI
 */
function updateUndoRedoUI() {
    const undoBtn = document.getElementById('undo-btn');
    const redoBtn = document.getElementById('redo-btn');
    
    if (undoBtn) {
        if (canUndo()) {
            undoBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            undoBtn.disabled = false;
            undoBtn.title = 'Undo (Ctrl+Z)';
        } else {
            undoBtn.classList.add('opacity-50', 'cursor-not-allowed');
            undoBtn.disabled = true;
            undoBtn.title = 'Nothing to undo';
        }
    }
    
    if (redoBtn) {
        if (canRedo()) {
            redoBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            redoBtn.disabled = false;
            redoBtn.title = 'Redo (Ctrl+Y)';
        } else {
            redoBtn.classList.add('opacity-50', 'cursor-not-allowed');
            redoBtn.disabled = true;
            redoBtn.title = 'Nothing to redo';
        }
    }
}

/**
 * Show toast notification for undo/redo
 */
function showUndoRedoToast(action) {
    const message = action === 'undo' ? 'Undo ✓' : 'Redo ✓';
    if (window.showToast) {
        window.showToast(message);
    } else {
        // Fallback toast
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 1500);
        }
    }
}

// ============================================================
// Keyboard Shortcuts
// ============================================================

/**
 * Setup keyboard shortcuts for undo/redo
 * @param {Function} onUndo - Callback for undo action
 * @param {Function} onRedo - Callback for redo action
 */
export function setupUndoRedoShortcuts(onUndo, onRedo) {
    window.addEventListener('keydown', (event) => {
        // Ctrl+Z (Undo)
        if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
            event.preventDefault();
            if (onUndo && canUndo()) {
                onUndo();
            }
        }
        
        // Ctrl+Y or Ctrl+Shift+Z (Redo)
        if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
            event.preventDefault();
            if (onRedo && canRedo()) {
                onRedo();
            }
        }
    });
}

// ============================================================
// History Management with Grouping
// ============================================================

let batchMode = false;
let batchData = null;

/**
 * Start batch mode - multiple actions grouped as one history entry
 */
export function startBatch() {
    if (batchMode) return;
    batchMode = true;
    batchData = null;
}

/**
 * End batch mode and save grouped action to history
 * @param {Array} finalFurnitureData - Final state after all batch actions
 * @param {Object} sceneRef - Scene reference
 */
export function endBatch(finalFurnitureData, sceneRef = null) {
    if (!batchMode) return;
    batchMode = false;
    
    if (finalFurnitureData) {
        saveStateToHistory(finalFurnitureData, sceneRef);
    }
    batchData = null;
}

/**
 * Check if in batch mode
 * @returns {boolean}
 */
export function isBatchMode() {
    return batchMode;
}

// ============================================================
// State Comparison (for optimization)
// ============================================================

/**
 * Compare two furniture states to see if they're different
 * @param {Array} stateA - First state
 * @param {Array} stateB - Second state
 * @returns {boolean}
 */
export function areStatesEqual(stateA, stateB) {
    if (!stateA && !stateB) return true;
    if (!stateA || !stateB) return false;
    if (stateA.length !== stateB.length) return false;
    
    return JSON.stringify(stateA) === JSON.stringify(stateB);
}

/**
 * Get history stack size
 * @returns {number}
 */
export function getHistorySize() {
    return historyStack.length;
}

/**
 * Get current history index
 * @returns {number}
 */
export function getCurrentIndex() {
    return currentIndex;
}

// ============================================================
// Save specific action with metadata
// ============================================================

/**
 * Save state with action metadata (for debugging/analytics)
 * @param {Array} furnitureData - Furniture data
 * @param {string} actionName - Name of the action being performed
 * @param {Object} sceneRef - Scene reference
 */
export function saveStateWithMetadata(furnitureData, actionName, sceneRef = null) {
    saveStateToHistory(furnitureData, sceneRef, { actionName });
    console.log(`📝 Action '${actionName}' saved to history`);
}

// ============================================================
// Export all functions
// ============================================================

// For backward compatibility with main.js
export default {
    saveStateToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    getHistoryInfo,
    setupUndoRedoShortcuts,
    startBatch,
    endBatch,
    isBatchMode,
    getHistorySize,
    getCurrentIndex
};

console.log('⏪ Undo/Redo module loaded');
