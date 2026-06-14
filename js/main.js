/**
 * Interior Studio Pro - Main Entry Point
 * Initializes the 3D scene, UI, and all core functionality
 */

import * as THREE from 'three';
import { initScene, getScene, getCamera, getRenderer, getControls, updateLightingPreset, setWireframeMode, toggleGrid, setWallColor, updateRoomDimensions } from './scene.js';
import { 
    roomTypes, categoryMap, furnitureItems, matColors, 
    roomPresets, builders, getCurrentRoomType, setCurrentRoomType,
    getCurrentCategory, setCurrentCategory,
    getCurrentMatType, setCurrentMatType,
    getCurrentColor, setCurrentColor,
    wallColorOptions, setBuilders
} from './data.js';
import * as BuildersModule from './builders.js';
import { 
    addFurniture, addFurnitureAndSelect, selectItem, deselectAll, 
    deleteSelected, duplicateSelected, applyMaterial, clearAllFurniture,
    getPlacedItems, getSelectedItem, setPlacedItems, updateItemCount,
    getAllFurnitureData, restoreFurnitureFromData, initControls
} from './controls.js';
import { 
    saveStateToHistory, undo, redo, canUndo, canRedo, clearHistory, 
    getHistoryInfo, setupUndoRedoShortcuts
} from './undo-redo.js';
import { 
    saveProjectToFile, loadProjectFromFile, exportProjectToJSON, 
    importProjectFromJSON, saveToLocalStorage, loadFromLocalStorage,
    autoSave, loadAutosave, hasAutosave
} from './storage.js';
import { showToast, generateId, formatDistance, debounce, getElement } from './utils.js';

// Register builders from builders module
setBuilders(BuildersModule);

// ============================================================
// DOM Elements
// ============================================================

const roomTypeGrid = document.getElementById('room-type-grid');
const catTabs = document.getElementById('cat-tabs');
const furnGrid = document.getElementById('furn-grid');
const matTypesContainer = document.getElementById('mat-types');
const colorSwatches = document.getElementById('color-swatches');
const wallColorsContainer = document.getElementById('wall-colors');
const roomWidthSlider = document.getElementById('room-width');
const roomDepthSlider = document.getElementById('room-depth');
const wallHeightSlider = document.getElementById('wall-height');
const rwVal = document.getElementById('rw-val');
const rdVal = document.getElementById('rd-val');
const whVal = document.getElementById('wh-val');
const roomTitle = document.getElementById('room-title');
const roomInfo = document.getElementById('room-info');
const currentMatSpan = document.getElementById('current-mat');
const selectedName = document.getElementById('sel-name');
const selectedDesc = document.getElementById('sel-desc');
const itemPanel = document.getElementById('item-panel');
const itemCountSpan = document.getElementById('item-count');
const measureDisplay = document.getElementById('measure-display');
const measureValue = document.getElementById('measure-value');
const loadingScreen = document.getElementById('loading-screen');

// Buttons
const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const resetBtn = document.getElementById('btn-reset');
const presetBtn = document.getElementById('btn-preset');
const screenshotBtn = document.getElementById('btn-screenshot');
const deleteBtn = document.getElementById('btn-delete');
const closePanelBtn = document.getElementById('close-panel');
const rotLeftBtn = document.getElementById('rot-l');
const rotRightBtn = document.getElementById('rot-r');
const dupBtn = document.getElementById('dup-item');
const raiseBtn = document.getElementById('raise-item');
const lowerBtn = document.getElementById('lower-item');
const undoBtn = document.getElementById('undo-btn');
const redoBtn = document.getElementById('redo-btn');
const saveBtn = document.getElementById('save-btn');
const loadBtn = document.getElementById('load-btn');
const exportBtn = document.getElementById('export-btn');
const measureBtn = document.getElementById('measure-btn');
const darkModeBtn = document.getElementById('darkmode-btn');
const topViewBtn = document.getElementById('btn-top');
const frontViewBtn = document.getElementById('btn-front');
const perspViewBtn = document.getElementById('btn-persp');
const autoRotateBtn = document.getElementById('btn-autorot');
const wireframeBtn = document.getElementById('btn-wireframe');
const gridBtn = document.getElementById('btn-grid');
const loadFileInput = document.getElementById('load-file-input');

// Lighting preset buttons
const lightPresetBtns = document.querySelectorAll('.light-preset');

// ============================================================
// State Variables
// ============================================================

let currentRoomType = 'living';
let currentCategory = 'seating';
let currentMatType = 'fabric';
let currentColor = '#8A8478';
let autoRotate = false;
let measureMode = false;
let measurePoints = [];
let measureLine = null;
let sceneRef = null;
let cameraRef = null;
let controlsRef = null;
let rendererRef = null;

// ============================================================
// UI Rendering Functions
// ============================================================

function renderRoomTypes() {
    if (!roomTypeGrid) return;
    roomTypeGrid.innerHTML = '';
    
    roomTypes.forEach(rt => {
        const el = document.createElement('div');
        el.className = `room-type-btn ${currentRoomType === rt.id ? 'active' : ''}`;
        el.innerHTML = `<i class="fas ${rt.icon} mr-1"></i>${rt.label}`;
        el.title = `${rt.label} — ${rt.w}×${rt.d}×${rt.h}m`;
        el.addEventListener('click', () => switchRoomType(rt.id));
        roomTypeGrid.appendChild(el);
    });
}

function renderCatTabs() {
    if (!catTabs) return;
    catTabs.innerHTML = '';
    
    const cats = categoryMap[currentRoomType] || [];
    if (cats.length === 0) {
        catTabs.innerHTML = '<span class="text-[10px]" style="color:var(--muted)">No categories</span>';
        return;
    }
    
    cats.forEach(cat => {
        const el = document.createElement('div');
        el.className = `cat-tab ${currentCategory === cat.id ? 'active' : ''}`;
        el.innerHTML = `<i class="fas ${cat.icon} mr-1"></i>${cat.label}`;
        el.addEventListener('click', () => {
            currentCategory = cat.id;
            setCurrentCategory(currentCategory);
            renderCatTabs();
            renderFurnGrid();
        });
        catTabs.appendChild(el);
    });
}

function renderFurnGrid() {
    if (!furnGrid) return;
    furnGrid.innerHTML = '';
    
    const items = furnitureItems[currentCategory] || [];
    if (items.length === 0) {
        furnGrid.innerHTML = '<p class="text-[10px] col-span-2 text-center py-4" style="color:var(--muted)">No items in this category</p>';
        return;
    }
    
    items.forEach((item, i) => {
        const el = document.createElement('div');
        el.className = 'furn-card fade-up';
        el.style.animationDelay = `${i * 0.03}s`;
        el.innerHTML = `
            <div class="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style="background:var(--warm)">
                <i class="fas ${item.icon} text-xs" style="color:var(--accent)"></i>
            </div>
            <p class="text-xs font-semibold leading-tight">${item.name}</p>
            <p class="text-[10px] mt-0.5" style="color:var(--muted)">${item.desc}</p>
        `;
        el.addEventListener('click', () => {
            addFurnitureAndSelect(item.fn, currentColor, currentMatType);
            saveStateToHistory(getAllFurnitureData(), sceneRef);
            updateItemCountDisplay();
        });
        furnGrid.appendChild(el);
    });
}

function renderMatTypes() {
    if (!matTypesContainer) return;
    matTypesContainer.innerHTML = '';
    
    ['fabric', 'leather', 'wood', 'metal', 'ceramic'].forEach(t => {
        const el = document.createElement('button');
        el.className = `mat-type ${currentMatType === t ? 'active' : ''}`;
        el.textContent = t.charAt(0).toUpperCase() + t.slice(1);
        el.addEventListener('click', () => {
            currentMatType = t;
            setCurrentMatType(currentMatType);
            renderMatTypes();
            renderColorSwatches();
            const selected = getSelectedItem();
            if (selected) applyMaterial(currentColor, t);
        });
        matTypesContainer.appendChild(el);
    });
}

function renderColorSwatches() {
    if (!colorSwatches) return;
    colorSwatches.innerHTML = '';
    
    const colors = matColors[currentMatType] || matColors.fabric;
    colors.forEach(c => {
        const el = document.createElement('div');
        el.className = `mat-swatch ${currentColor === c ? 'active' : ''}`;
        el.style.background = c;
        el.title = c;
        el.addEventListener('click', () => {
            currentColor = c;
            setCurrentColor(currentColor);
            renderColorSwatches();
            const selected = getSelectedItem();
            if (selected) applyMaterial(c, currentMatType);
        });
        colorSwatches.appendChild(el);
    });
}

function renderWallColors() {
    if (!wallColorsContainer) return;
    wallColorsContainer.innerHTML = '';
    
    wallColorOptions.forEach(wc => {
        const el = document.createElement('div');
        el.className = `mat-swatch`;
        el.style.background = wc.color;
        el.title = wc.name;
        el.dataset.wc = wc.color;
        el.addEventListener('click', () => {
            document.querySelectorAll('#wall-colors .mat-swatch').forEach(s => s.classList.remove('active'));
            el.classList.add('active');
            setWallColor(wc.color, sceneRef);
        });
        wallColorsContainer.appendChild(el);
    });
}

function updateSelectionUI(item) {
    if (!item || !item.userData) {
        if (itemPanel) itemPanel.classList.add('hidden');
        if (currentMatSpan) currentMatSpan.textContent = '—';
        return;
    }
    
    if (itemPanel) itemPanel.classList.remove('hidden');
    if (selectedName) selectedName.textContent = item.userData.name || 'Item';
    if (selectedDesc) selectedDesc.textContent = item.userData.desc || '';
    if (currentMatSpan) currentMatSpan.textContent = `${item.userData.matType || 'fabric'} — ${item.userData.matColor || '#8A8478'}`;
    
    const itemMatType = item.userData.matType || 'fabric';
    document.querySelectorAll('#mat-types .mat-type').forEach(el => {
        el.classList.toggle('active', el.textContent.toLowerCase() === itemMatType);
    });
    
    const itemColor = item.userData.matColor || '#8A8478';
    document.querySelectorAll('#color-swatches .mat-swatch').forEach(el => {
        el.classList.toggle('active', el.title === itemColor);
    });
}

function updateRoomInfoDisplay() {
    if (roomInfo) {
        const count = getPlacedItems().length;
        roomInfo.textContent = `Click to select · Drag to move · ${count} items placed`;
    }
}

function updateItemCountDisplay() {
    if (itemCountSpan) {
        itemCountSpan.textContent = getPlacedItems().length;
    }
}

// ============================================================
// Core Functions
// ============================================================

function switchRoomType(typeId) {
    currentRoomType = typeId;
    setCurrentRoomType(typeId);
    
    const rt = roomTypes.find(r => r.id === typeId);
    if (rt) {
        if (roomWidthSlider) roomWidthSlider.value = rt.w;
        if (roomDepthSlider) roomDepthSlider.value = rt.d;
        if (wallHeightSlider) wallHeightSlider.value = rt.h;
        if (rwVal) rwVal.textContent = rt.w.toFixed(1) + 'm';
        if (rdVal) rdVal.textContent = rt.d.toFixed(1) + 'm';
        if (whVal) whVal.textContent = rt.h.toFixed(1) + 'm';
        if (roomTitle) roomTitle.textContent = rt.label;
        
        document.querySelectorAll('#wall-colors .mat-swatch').forEach(s => {
            s.classList.toggle('active', s.dataset.wc === rt.wallCol);
        });
        
        setWallColor(rt.wallCol, sceneRef);
        updateRoomDimensions(rt.w, rt.d, rt.h);
    }
    
    const cats = categoryMap[typeId] || [];
    currentCategory = cats.length > 0 ? cats[0].id : 'seating';
    setCurrentCategory(currentCategory);
    
    renderRoomTypes();
    renderCatTabs();
    renderFurnGrid();
    
    clearAllFurniture();
    loadRoomPreset(typeId);
    updateRoomInfoDisplay();
    updateItemCountDisplay();
    deselectAll();
    saveStateToHistory(getAllFurnitureData(), sceneRef);
    showToast(`Switched to ${rt?.label || typeId}`);
}

function loadRoomPreset(typeId) {
    const preset = roomPresets[typeId] || [];
    preset.forEach(p => {
        addFurniture(p.fn, p.col, p.mtype, p.pos, p.rot);
    });
    updateItemCountDisplay();
}

function resetRoom() {
    const rt = roomTypes.find(r => r.id === currentRoomType);
    if (rt) {
        if (roomWidthSlider) roomWidthSlider.value = rt.w;
        if (roomDepthSlider) roomDepthSlider.value = rt.d;
        if (wallHeightSlider) wallHeightSlider.value = rt.h;
        if (rwVal) rwVal.textContent = rt.w.toFixed(1) + 'm';
        if (rdVal) rdVal.textContent = rt.d.toFixed(1) + 'm';
        if (whVal) whVal.textContent = rt.h.toFixed(1) + 'm';
        
        document.querySelectorAll('#wall-colors .mat-swatch').forEach(s => {
            s.classList.toggle('active', s.dataset.wc === rt.wallCol);
        });
        
        setWallColor(rt.wallCol, sceneRef);
        updateRoomDimensions(rt.w, rt.d, rt.h);
    }
    
    clearAllFurniture();
    loadRoomPreset(currentRoomType);
    updateRoomInfoDisplay();
    updateItemCountDisplay();
    deselectAll();
    saveStateToHistory(getAllFurnitureData(), sceneRef);
    showToast('Room reset with default furniture');
}

function takeScreenshot() {
    if (!rendererRef || !sceneRef || !cameraRef) return;
    rendererRef.render(sceneRef, cameraRef);
    const link = document.createElement('a');
    link.download = `interior-${currentRoomType}-${Date.now()}.png`;
    link.href = rendererRef.domElement.toDataURL('image/png');
    link.click();
    showToast('Screenshot saved');
}

function saveProject() {
    const furnitureData = getAllFurnitureData();
    const roomData = {
        type: currentRoomType,
        width: parseFloat(roomWidthSlider?.value || 8),
        depth: parseFloat(roomDepthSlider?.value || 6),
        height: parseFloat(wallHeightSlider?.value || 3)
    };
    saveProjectToFile(furnitureData, roomData);
}

function loadProject() {
    if (loadFileInput) loadFileInput.click();
}

function handleFileLoad(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    loadProjectFromFile(file, (furnitureData, roomData) => {
        if (roomData) {
            if (roomWidthSlider) roomWidthSlider.value = roomData.width;
            if (roomDepthSlider) roomDepthSlider.value = roomData.depth;
            if (wallHeightSlider) wallHeightSlider.value = roomData.height;
            if (rwVal) rwVal.textContent = roomData.width.toFixed(1) + 'm';
            if (rdVal) rdVal.textContent = roomData.depth.toFixed(1) + 'm';
            if (whVal) whVal.textContent = roomData.height.toFixed(1) + 'm';
            
            if (roomData.type && roomData.type !== currentRoomType) {
                switchRoomType(roomData.type);
            }
            
            updateRoomDimensions(roomData.width, roomData.depth, roomData.height);
        }
        
        clearAllFurniture();
        restoreFurnitureFromData(furnitureData, BuildersModule);
        updateItemCountDisplay();
        deselectAll();
        saveStateToHistory(getAllFurnitureData(), sceneRef);
        showToast('Project loaded successfully');
    });
}

function exportProject() {
    const furnitureData = getAllFurnitureData();
    const roomData = {
        type: currentRoomType,
        width: parseFloat(roomWidthSlider?.value || 8),
        depth: parseFloat(roomDepthSlider?.value || 6),
        height: parseFloat(wallHeightSlider?.value || 3)
    };
    exportProjectToJSON(furnitureData, roomData);
}

function toggleMeasureMode() {
    measureMode = !measureMode;
    if (measureMode) {
        measurePoints = [];
        showToast('Measure mode ON — Click two points to measure distance');
        if (measureBtn) measureBtn.style.color = 'var(--accent)';
    } else {
        if (measureLine && sceneRef) sceneRef.remove(measureLine);
        measureLine = null;
        if (measureDisplay) measureDisplay.classList.add('hidden');
        if (measureBtn) measureBtn.style.color = '';
        showToast('Measure mode OFF');
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    if (darkModeBtn) {
        darkModeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    showToast(isDark ? 'Dark mode ON' : 'Light mode ON');
}

function handleUndo() {
    if (!canUndo()) {
        showToast('Nothing to undo');
        return;
    }
    const data = undo();
    if (data && data.furniture) {
        clearAllFurniture();
        restoreFurnitureFromData(data.furniture, BuildersModule);
        updateItemCountDisplay();
        deselectAll();
        showToast('Undo');
    }
}

function handleRedo() {
    if (!canRedo()) {
        showToast('Nothing to redo');
        return;
    }
    const data = redo();
    if (data && data.furniture) {
        clearAllFurniture();
        restoreFurnitureFromData(data.furniture, BuildersModule);
        updateItemCountDisplay();
        deselectAll();
        showToast('Redo');
    }
}

// ============================================================
// Event Handlers Setup
// ============================================================

function setupEventListeners() {
    roomWidthSlider?.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (rwVal) rwVal.textContent = val.toFixed(1) + 'm';
        updateRoomDimensions(val, null, null);
        updateRoomInfoDisplay();
    });
    
    roomDepthSlider?.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (rdVal) rdVal.textContent = val.toFixed(1) + 'm';
        updateRoomDimensions(null, val, null);
        updateRoomInfoDisplay();
    });
    
    wallHeightSlider?.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (whVal) whVal.textContent = val.toFixed(1) + 'm';
        updateRoomDimensions(null, null, val);
    });
    
    resetBtn?.addEventListener('click', resetRoom);
    presetBtn?.addEventListener('click', () => {
        clearAllFurniture();
        loadRoomPreset(currentRoomType);
        updateItemCountDisplay();
        deselectAll();
        saveStateToHistory(getAllFurnitureData(), sceneRef);
        showToast('Room preset loaded');
    });
    screenshotBtn?.addEventListener('click', takeScreenshot);
    deleteBtn?.addEventListener('click', () => {
        deleteSelected();
        updateItemCountDisplay();
        saveStateToHistory(getAllFurnitureData(), sceneRef);
    });
    closePanelBtn?.addEventListener('click', deselectAll);
    
    rotLeftBtn?.addEventListener('click', () => {
        const selected = getSelectedItem();
        if (selected) selected.rotation.y += Math.PI / 12;
    });
    rotRightBtn?.addEventListener('click', () => {
        const selected = getSelectedItem();
        if (selected) selected.rotation.y -= Math.PI / 12;
    });
    dupBtn?.addEventListener('click', () => {
        duplicateSelected();
        updateItemCountDisplay();
        saveStateToHistory(getAllFurnitureData(), sceneRef);
    });
    raiseBtn?.addEventListener('click', () => {
        const selected = getSelectedItem();
        if (selected) {
            selected.position.y += 0.1;
            showToast('Raised item');
            saveStateToHistory(getAllFurnitureData(), sceneRef);
        }
    });
    lowerBtn?.addEventListener('click', () => {
        const selected = getSelectedItem();
        if (selected) {
            selected.position.y = Math.max(0, selected.position.y - 0.1);
            showToast('Lowered item');
            saveStateToHistory(getAllFurnitureData(), sceneRef);
        }
    });
    
    undoBtn?.addEventListener('click', handleUndo);
    redoBtn?.addEventListener('click', handleRedo);
    saveBtn?.addEventListener('click', saveProject);
    loadBtn?.addEventListener('click', loadProject);
    exportBtn?.addEventListener('click', exportProject);
    measureBtn?.addEventListener('click', toggleMeasureMode);
    darkModeBtn?.addEventListener('click', toggleDarkMode);
    loadFileInput?.addEventListener('change', handleFileLoad);
    
    topViewBtn?.addEventListener('click', () => {
        if (controlsRef && cameraRef) {
            controlsRef.target.set(0, 1.5, 0);
            cameraRef.position.set(0, 10, 0.01);
            controlsRef.update();
        }
    });
    frontViewBtn?.addEventListener('click', () => {
        if (controlsRef && cameraRef) {
            controlsRef.target.set(0, 1.5, 0);
            cameraRef.position.set(0, 2, 8);
            controlsRef.update();
        }
    });
    perspViewBtn?.addEventListener('click', () => {
        if (controlsRef && cameraRef) {
            controlsRef.target.set(0, 1.5, 0);
            cameraRef.position.set(7, 6, 9);
            controlsRef.update();
        }
    });
    autoRotateBtn?.addEventListener('click', () => {
        autoRotate = !autoRotate;
        if (controlsRef) controlsRef.autoRotate = autoRotate;
        if (autoRotateBtn) {
            autoRotateBtn.style.color = autoRotate ? 'var(--accent)' : '';
        }
        showToast(autoRotate ? 'Auto-rotate ON' : 'Auto-rotate OFF');
    });
    wireframeBtn?.addEventListener('click', () => {
        const isWireframe = setWireframeMode(sceneRef);
        if (wireframeBtn) {
            wireframeBtn.style.color = isWireframe ? 'var(--accent2)' : '';
        }
        showToast(isWireframe ? 'Wireframe ON' : 'Wireframe OFF');
    });
    gridBtn?.addEventListener('click', () => {
        toggleGrid(sceneRef);
        showToast('Grid toggled');
    });
    
    toggleSidebarBtn?.addEventListener('click', () => {
        document.getElementById('sidebar')?.classList.toggle('collapsed');
        setTimeout(() => {
            if (rendererRef) {
                const main = document.querySelector('main');
                const w = main?.clientWidth || window.innerWidth;
                const h = main?.clientHeight || window.innerHeight;
                rendererRef.setSize(w, h);
                if (cameraRef) cameraRef.aspect = w / h;
                cameraRef?.updateProjectionMatrix();
            }
        }, 400);
    });
    
    lightPresetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            lightPresetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const preset = btn.dataset.light;
            updateLightingPreset(preset);
            showToast(`${preset.charAt(0).toUpperCase() + preset.slice(1)} lighting`);
        });
    });
}

// ============================================================
// Selection Listener
// ============================================================

window.addEventListener('itemSelected', (e) => {
    updateSelectionUI(e.detail.item);
});

window.addEventListener('itemDeselected', () => {
    updateSelectionUI(null);
});

// ============================================================
// Animation Loop
// ============================================================

function animate() {
    requestAnimationFrame(animate);
    if (controlsRef) controlsRef.update();
    if (rendererRef && sceneRef && cameraRef) {
        rendererRef.render(sceneRef, cameraRef);
    }
}

// ============================================================
// Initialization
// ============================================================

async function init() {
    console.log('🚀 Initializing Interior Studio Pro...');
    
    // Initialize scene
    const { scene, camera, renderer, controls } = await initScene();
    sceneRef = scene;
    cameraRef = camera;
    rendererRef = renderer;
    controlsRef = controls;
    
    console.log('✅ Scene initialized');
    
    // Initialize controls with references
    const canvas = document.getElementById('viewer-canvas');
    initControls(canvas, camera, scene, controls);
    
    // Render UI
    renderRoomTypes();
    renderCatTabs();
    renderFurnGrid();
    renderMatTypes();
    renderColorSwatches();
    renderWallColors();
    
    // Load default room preset
    loadRoomPreset('living');
    updateItemCountDisplay();
    updateRoomInfoDisplay();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup undo/redo shortcuts
    setupUndoRedoShortcuts(handleUndo, handleRedo);
    
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark');
        if (darkModeBtn) darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Check for autosave
    if (hasAutosave()) {
        const autosave = loadAutosave();
        if (autosave && autosave.furniture && autosave.furniture.length > 0) {
            showToast('Auto-save found! Load it from the Load button.', 'info');
        }
    }
    
    // Hide loading screen
    setTimeout(() => {
        if (loadingScreen) loadingScreen.classList.add('hide');
        setTimeout(() => {
            if (loadingScreen) loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);
    
    // Start animation
    animate();
    
    showToast('Welcome to Interior Studio Pro! 🎨');
    console.log('🏠 Interior Studio Pro — Ready!');
}

// Start the app
init();
