/**
 * Interior Studio Pro - Main Entry Point
 * Initializes the 3D scene, UI, and all core functionality
 */

import * as THREE from 'three';
import { initScene, getScene, getCamera, getRenderer, getControls, updateLightingPreset, setWireframeMode, toggleGrid, setWallColor } from './scene.js';
import { 
    roomTypes, categoryMap, furnitureItems, matColors, 
    roomPresets, builders, getCurrentRoomType, setCurrentRoomType,
    getCurrentCategory, setCurrentCategory,
    getCurrentMatType, setCurrentMatType,
    getCurrentColor, setCurrentColor,
    getWallColorsList
} from './data.js';
import { 
    addFurniture, addFurnitureAndSelect, selectItem, deselectAll, 
    deleteSelected, duplicateSelected, applyMaterial, clearAllFurniture,
    getPlacedItems, getSelectedItem, setPlacedItems, updateItemCount,
    getAllFurnitureData, restoreFurnitureFromData
} from './controls.js';
import { 
    pushState, canUndo, canRedo, undo, redo, clearHistory, 
    saveStateToHistory, loadLayoutFromData
} from './undo-redo.js';
import { 
    saveProjectToFile, loadProjectFromFile, exportProjectToJSON, 
    importProjectFromJSON, exportToLocalStorage, loadFromLocalStorage
} from './storage.js';
import { showToast, generateId, formatDistance, debounce } from './utils.js';

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
const toast = document.getElementById('toast');
const loadingScreen = document.getElementById('loading-screen');
const itemCountSpan = document.getElementById('item-count');
const measureDisplay = document.getElementById('measure-display');
const measureValue = document.getElementById('measure-value');

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

/**
 * Render room type selector
 */
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

/**
 * Render category tabs based on current room type
 */
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

/**
 * Render furniture grid based on current category
 */
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
        });
        furnGrid.appendChild(el);
    });
}

/**
 * Render material type tabs
 */
function renderMatTypes() {
    if (!matTypesContainer) return;
    matTypesContainer.innerHTML = '';
    
    ['fabric', 'leather', 'wood', 'metal'].forEach(t => {
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

/**
 * Render color swatches for current material type
 */
function renderColorSwatches() {
    if (!colorSwatches) return;
    colorSwatches.innerHTML = '';
    
    const colors = matColors[currentMatType] || [];
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

/**
 * Render wall color swatches
 */
function renderWallColors() {
    if (!wallColorsContainer) return;
    wallColorsContainer.innerHTML = '';
    
    const wallColorsList = getWallColorsList();
    wallColorsList.forEach(wc => {
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

/**
 * Update UI when an item is selected
 */
function updateSelectionUI(item) {
    if (!item || !item.userData) {
        itemPanel?.classList.add('hidden');
        currentMatSpan.textContent = '—';
        return;
    }
    
    itemPanel?.classList.remove('hidden');
    if (selectedName) selectedName.textContent = item.userData.name || 'Item';
    if (selectedDesc) selectedDesc.textContent = item.userData.desc || '';
    if (currentMatSpan) currentMatSpan.textContent = `${item.userData.matType || 'fabric'} — ${item.userData.matColor || '#8A8478'}`;
    
    // Update active material type tab
    const itemMatType = item.userData.matType || 'fabric';
    document.querySelectorAll('#mat-types .mat-type').forEach(el => {
        el.classList.toggle('active', el.textContent.toLowerCase() === itemMatType);
    });
    
    // Update active color swatch
    const itemColor = item.userData.matColor || '#8A8478';
    document.querySelectorAll('#color-swatches .mat-swatch').forEach(el => {
        el.classList.toggle('active', el.title === itemColor);
    });
}

/**
 * Update room info display
 */
function updateRoomInfo() {
    const scene = getScene();
    if (!scene) return;
    
    if (roomInfo) {
        roomInfo.textContent = `Click to select · Drag to move · ${getPlacedItems().length} items placed`;
    }
}

/**
 * Update item count display
 */
function updateItemCountDisplay() {
    if (itemCountSpan) {
        itemCountSpan.textContent = getPlacedItems().length;
    }
}

// ============================================================
// Core Functions
// ============================================================

/**
 * Switch room type
 */
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
        
        // Update active wall color swatch
        document.querySelectorAll('#wall-colors .mat-swatch').forEach(s => {
            s.classList.toggle('active', s.dataset.wc === rt.wallCol);
        });
    }
    
    // Reset category to first available
    const cats = categoryMap[typeId] || [];
    currentCategory = cats.length > 0 ? cats[0].id : 'seating';
    setCurrentCategory(currentCategory);
    
    // Rebuild room in scene
    if (sceneRef) {
        // This will be handled by scene.js via event or direct call
        window.dispatchEvent(new CustomEvent('roomChanged', { 
            detail: { width: rt?.w || 8, depth: rt?.d || 6, height: rt?.h || 3 }
        }));
    }
    
    renderRoomTypes();
    renderCatTabs();
    renderFurnGrid();
    
    clearAllFurniture();
    loadRoomPreset(typeId);
    updateRoomInfo();
    updateItemCountDisplay();
    deselectAll();
    saveStateToHistory(getAllFurnitureData(), sceneRef);
    showToast(`Switched to ${rt?.label || typeId}`);
}

/**
 * Load room preset furniture
 */
function loadRoomPreset(typeId) {
    const preset = roomPresets[typeId] || [];
    preset.forEach(p => {
        addFurniture(p.fn, p.col, p.mtype, p.pos, p.rot);
    });
    updateItemCountDisplay();
}

/**
 * Reset current room
 */
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
    }
    
    clearAllFurniture();
    loadRoomPreset(currentRoomType);
    updateRoomInfo();
    updateItemCountDisplay();
    deselectAll();
    saveStateToHistory(getAllFurnitureData(), sceneRef);
    showToast('Room reset with default furniture');
}

/**
 * Take screenshot
 */
function takeScreenshot() {
    if (!rendererRef) return;
    rendererRef.render(sceneRef, cameraRef);
    const link = document.createElement('a');
    link.download = `interior-${currentRoomType}-${Date.now()}.png`;
    link.href = rendererRef.domElement.toDataURL('image/png');
    link.click();
    showToast('Screenshot saved');
}

/**
 * Save project to file
 */
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

/**
 * Load project from file
 */
function loadProject() {
    loadFileInput?.click();
}

/**
 * Handle file load
 */
function handleFileLoad(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    
    loadProjectFromFile(file, (furnitureData, roomData) => {
        // Update room dimensions
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
        }
        
        // Clear existing furniture and load new
        clearAllFurniture();
        restoreFurnitureFromData(furnitureData, builders);
        updateItemCountDisplay();
        deselectAll();
        saveStateToHistory(getAllFurnitureData(), sceneRef);
        showToast('Project loaded successfully');
    });
}

/**
 * Export project as JSON
 */
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

/**
 * Toggle measure mode
 */
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

/**
 * Add measure point
 */
function addMeasurePoint(position) {
    if (!measureMode) return;
    
    measurePoints.push(position.clone());
    
    // Visual feedback - add a temporary sphere
    const sphereMat = new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0x441111 });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), sphereMat);
    sphere.position.copy(position);
    sceneRef?.add(sphere);
    setTimeout(() => sceneRef?.remove(sphere), 500);
    
    if (measurePoints.length === 2) {
        // Calculate distance
        const p1 = measurePoints[0];
        const p2 = measurePoints[1];
        const distance = p1.distanceTo(p2);
        
        // Create line
        if (measureLine && sceneRef) sceneRef.remove(measureLine);
        const points = [p1, p2];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xff4444, linewidth: 2 });
        measureLine = new THREE.Line(geometry, material);
        sceneRef?.add(measureLine);
        
        // Show measurement
        if (measureValue) measureValue.textContent = distance.toFixed(2);
        if (measureDisplay) measureDisplay.classList.remove('hidden');
        showToast(`Distance: ${distance.toFixed(2)} meters`);
        
        // Auto exit measure mode after measurement
        setTimeout(() => toggleMeasureMode(), 100);
    } else {
        showToast('Click second point to measure distance');
    }
}

/**
 * Toggle dark mode
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    if (darkModeBtn) {
        darkModeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }
    showToast(isDark ? 'Dark mode ON' : 'Light mode ON');
}

/**
 * Handle undo
 */
function handleUndo() {
    if (!canUndo()) {
        showToast('Nothing to undo');
        return;
    }
    const data = undo();
    if (data) {
        clearAllFurniture();
        restoreFurnitureFromData(data.furniture, builders);
        updateItemCountDisplay();
        deselectAll();
        showToast('Undo');
    }
}

/**
 * Handle redo
 */
function handleRedo() {
    if (!canRedo()) {
        showToast('Nothing to redo');
        return;
    }
    const data = redo();
    if (data) {
        clearAllFurniture();
        restoreFurnitureFromData(data.furniture, builders);
        updateItemCountDisplay();
        deselectAll();
        showToast('Redo');
    }
}

// ============================================================
// Event Handlers Setup
// ============================================================

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Room dimension sliders
    roomWidthSlider?.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (rwVal) rwVal.textContent = val.toFixed(1) + 'm';
        window.dispatchEvent(new CustomEvent('roomChanged', { detail: { width: val } }));
    });
    
    roomDepthSlider?.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (rdVal) rdVal.textContent = val.toFixed(1) + 'm';
        window.dispatchEvent(new CustomEvent('roomChanged', { detail: { depth: val } }));
    });
    
    wallHeightSlider?.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (whVal) whVal.textContent = val.toFixed(1) + 'm';
        window.dispatchEvent(new CustomEvent('roomChanged', { detail: { height: val } }));
    });
    
    // Action buttons
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
    
    // Item manipulation
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
    
    // Quick actions
    undoBtn?.addEventListener('click', handleUndo);
    redoBtn?.addEventListener('click', handleRedo);
    saveBtn?.addEventListener('click', saveProject);
    loadBtn?.addEventListener('click', loadProject);
    exportBtn?.addEventListener('click', exportProject);
    measureBtn?.addEventListener('click', toggleMeasureMode);
    darkModeBtn?.addEventListener('click', toggleDarkMode);
    loadFileInput?.addEventListener('change', handleFileLoad);
    
    // View controls
    topViewBtn?.addEventListener('click', () => {
        if (controlsRef) {
            controlsRef.target.set(0, 1, 0);
            cameraRef?.position.set(0, 10, 0.01);
            controlsRef.update();
        }
    });
    frontViewBtn?.addEventListener('click', () => {
        if (controlsRef) {
            controlsRef.target.set(0, 1, 0);
            cameraRef?.position.set(0, 2, 8);
            controlsRef.update();
        }
    });
    perspViewBtn?.addEventListener('click', () => {
        if (controlsRef) {
            controlsRef.target.set(0, 1, 0);
            cameraRef?.position.set(7, 6, 9);
            controlsRef.update();
        }
    });
    autoRotateBtn?.addEventListener('click', () => {
        autoRotate = !autoRotate;
        if (controlsRef) controlsRef.autoRotate = autoRotate;
        if (autoRotateBtn) {
            autoRotateBtn.style.color = autoRotate ? 'var(--accent)' : '';
            autoRotateBtn.style.borderColor = autoRotate ? 'var(--accent)' : '';
        }
        showToast(autoRotate ? 'Auto-rotate ON' : 'Auto-rotate OFF');
    });
    wireframeBtn?.addEventListener('click', () => {
        setWireframeMode(sceneRef);
        const isWireframe = sceneRef?.userData?.wireframeMode || false;
        if (wireframeBtn) {
            wireframeBtn.style.color = isWireframe ? 'var(--accent2)' : '';
            wireframeBtn.style.borderColor = isWireframe ? 'var(--accent2)' : '';
        }
        showToast(isWireframe ? 'Wireframe ON' : 'Wireframe OFF');
    });
    gridBtn?.addEventListener('click', () => {
        toggleGrid(sceneRef);
        showToast('Grid toggled');
    });
    
    // Sidebar toggle
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
    
    // Lighting presets
    lightPresetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            lightPresetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const preset = btn.dataset.light;
            updateLightingPreset(preset, sceneRef);
            showToast(`${preset.charAt(0).toUpperCase() + preset.slice(1)} lighting`);
        });
    });
}

// ============================================================
// Selection Listener (from controls.js)
// ============================================================

/**
 * Listen for selection changes
 */
function setupSelectionListener() {
    // Override selectItem to update UI
    const originalSelectItem = window.selectItemFn;
    window.selectItemWithUI = (item) => {
        updateSelectionUI(item);
        if (originalSelectItem) originalSelectItem(item);
    };
}

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

/**
 * Initialize the app
 */
async function init() {
    // Initialize scene
    const { scene, camera, renderer, controls } = await initScene();
    sceneRef = scene;
    cameraRef = camera;
    rendererRef = renderer;
    controlsRef = controls;
    
    // Set initial room dimensions from sliders
    const initialWidth = parseFloat(roomWidthSlider?.value || 8);
    const initialDepth = parseFloat(roomDepthSlider?.value || 6);
    const initialHeight = parseFloat(wallHeightSlider?.value || 3);
    
    // Listen for room changes
    window.addEventListener('roomChanged', (e) => {
        const { width, depth, height } = e.detail;
        if (width !== undefined) {
            if (rwVal) rwVal.textContent = width.toFixed(1) + 'm';
        }
        if (depth !== undefined) {
            if (rdVal) rdVal.textContent = depth.toFixed(1) + 'm';
        }
        if (height !== undefined) {
            if (whVal) whVal.textContent = height.toFixed(1) + 'm';
        }
        updateRoomInfo();
    });
    
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
    
    // Setup event listeners
    setupEventListeners();
    setupSelectionListener();
    
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark');
        if (darkModeBtn) darkModeBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Export functions to window for debugging
    window.debug = {
        getPlacedItems,
        getScene: () => sceneRef,
        clearAll: clearAllFurniture,
        saveState: () => saveStateToHistory(getAllFurnitureData(), sceneRef)
    };
    
    // Hide loading screen
    setTimeout(() => {
        if (loadingScreen) loadingScreen.classList.add('hide');
        setTimeout(() => {
            if (loadingScreen) loadingScreen.style.display = 'none';
        }, 500);
    }, 800);
    
    // Start animation
    animate();
    
    showToast('Welcome to Interior Studio Pro! 🎨');
    console.log('🏠 Interior Studio Pro — Ready!');
}

// Start the app
init();

// Export for other modules
export { addMeasurePoint, updateItemCountDisplay };