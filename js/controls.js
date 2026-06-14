/**
 * Interior Studio Pro - Controls Manager
 * Handles drag & drop, item selection, material application, and furniture management
 */

import * as THREE from 'three';
import { getScene, getCamera, getControls, getRoomGroup, getCurrentRoomDimensions } from './scene.js';
import { builders, getCurrentColor, getCurrentMatType } from './data.js';
import { showToast } from './utils.js';

// ============================================================
// State Variables
// ============================================================

let placedItems = [];
let selectedItem = null;
let isDragging = false;
let dragItem = null;
let dragPlane = null;
let dragOffset = new THREE.Vector3();
let intersectionPoint = new THREE.Vector3();
let raycaster = null;
let canvasElement = null;
let cameraRef = null;
let sceneRef = null;
let controlsRef = null;

// ============================================================
// Initialization
// ============================================================

/**
 * Initialize controls system
 */
export function initControls(canvas, camera, scene, controls) {
    canvasElement = canvas;
    cameraRef = camera;
    sceneRef = scene;
    controlsRef = controls;
    
    // Create drag plane
    dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    
    // Create raycaster
    raycaster = new THREE.Raycaster();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('🎮 Controls initialized');
}

/**
 * Setup mouse/touch event listeners
 */
function setupEventListeners() {
    if (!canvasElement) return;
    
    canvasElement.addEventListener('pointerdown', onPointerDown);
    canvasElement.addEventListener('pointermove', onPointerMove);
    canvasElement.addEventListener('pointerup', onPointerUp);
    canvasElement.addEventListener('click', onClick);
}

// ============================================================
// Raycasting Helpers
// ============================================================

/**
 * Get all meshes from placed furniture items
 */
function getAllFurnitureMeshes() {
    const meshes = [];
    placedItems.forEach(item => {
        item.traverse(child => {
            if (child.isMesh && child !== dragItem) {
                meshes.push(child);
            }
        });
    });
    return meshes;
}

/**
 * Find parent furniture group from a mesh
 */
function findParentFurniture(obj) {
    let current = obj;
    while (current) {
        if (current.userData && current.userData.isFurniture) {
            return current;
        }
        current = current.parent;
    }
    return null;
}

/**
 * Get pointer coordinates relative to canvas
 */
function getPointerCoords(event, rect) {
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    return { x, y };
}

// ============================================================
// Pointer Event Handlers
// ============================================================

let pointerDownTime = 0;
let pointerDownPos = { x: 0, y: 0 };

function onPointerDown(event) {
    if (!canvasElement || !cameraRef || !sceneRef) return;
    
    const rect = canvasElement.getBoundingClientRect();
    const { x, y } = getPointerCoords(event, rect);
    
    pointerDownTime = Date.now();
    pointerDownPos = { x: event.clientX, y: event.clientY };
    
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef);
    
    const meshes = getAllFurnitureMeshes();
    const hits = raycaster.intersectObjects(meshes, true);
    
    if (hits.length > 0) {
        const furniture = findParentFurniture(hits[0].object);
        if (furniture) {
            selectItem(furniture);
            dragItem = furniture;
            isDragging = true;
            
            if (controlsRef) controlsRef.enabled = false;
            
            // Calculate drag offset
            const planeNormal = new THREE.Vector3(0, 1, 0);
            const dragPlaneLocal = new THREE.Plane(planeNormal, 0);
            raycaster.ray.intersectPlane(dragPlaneLocal, intersectionPoint);
            dragOffset.copy(intersectionPoint).sub(furniture.position);
            dragOffset.y = 0;
            
            canvasElement.style.cursor = 'grabbing';
            event.preventDefault();
        }
    } else {
        // Click on empty space - deselect
        // But wait for click event to distinguish from drag start
    }
}

function onPointerMove(event) {
    if (!isDragging || !dragItem || !cameraRef || !canvasElement) return;
    
    const rect = canvasElement.getBoundingClientRect();
    const { x, y } = getPointerCoords(event, rect);
    
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef);
    
    if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
        const newPos = intersectionPoint.clone().sub(dragOffset);
        
        // Get room boundaries
        const dimensions = getCurrentRoomDimensions();
        const boundX = (dimensions.width / 2) - 0.3;
        const boundZ = (dimensions.depth / 2) - 0.3;
        
        dragItem.position.x = Math.max(-boundX, Math.min(boundX, newPos.x));
        dragItem.position.z = Math.max(-boundZ, Math.min(boundZ, newPos.z));
        
        // Update shadow if exists
        dragItem.children.forEach(child => {
            if (child.isMesh && child.material && child.material.transparent) {
                // Update shadow position
            }
        });
    }
    
    canvasElement.style.cursor = 'grabbing';
}

function onPointerUp(event) {
    if (isDragging && dragItem) {
        isDragging = false;
        dragItem = null;
        
        if (controlsRef) controlsRef.enabled = true;
        if (canvasElement) canvasElement.style.cursor = 'grab';
        
        // Save state to history after drag ends
        if (window.saveStateToHistory) {
            window.saveStateToHistory(getAllFurnitureData(), sceneRef);
        }
    }
}

function onClick(event) {
    // Check if this was a drag (movement) rather than a click
    const dragDistance = Math.sqrt(
        Math.pow(event.clientX - pointerDownPos.x, 2) + 
        Math.pow(event.clientY - pointerDownPos.y, 2)
    );
    
    if (dragDistance > 5) return; // Was a drag, not a click
    
    if (!canvasElement || !cameraRef || !sceneRef) return;
    
    const rect = canvasElement.getBoundingClientRect();
    const { x, y } = getPointerCoords(event, rect);
    
    raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef);
    
    const meshes = getAllFurnitureMeshes();
    const hits = raycaster.intersectObjects(meshes, true);
    
    if (hits.length > 0) {
        const furniture = findParentFurniture(hits[0].object);
        if (furniture) {
            selectItem(furniture);
        }
    } else {
        deselectAll();
    }
}

// ============================================================
// Furniture Management
// ============================================================

/**
 * Add furniture to scene
 */
export function addFurniture(fnName, color, materialType, position = null, rotation = 0) {
    const builder = builders[fnName];
    if (!builder) {
        console.error(`Builder not found: ${fnName}`);
        return null;
    }
    
    const item = builder(color, materialType);
    if (!item) return null;
    
    // Set position
    if (position) {
        item.position.set(position[0], position[1], position[2]);
    } else {
        // Random position within room bounds
        const dimensions = getCurrentRoomDimensions();
        const boundX = (dimensions.width / 2) - 0.5;
        const boundZ = (dimensions.depth / 2) - 0.5;
        item.position.set(
            (Math.random() - 0.5) * boundX * 1.5,
            0,
            (Math.random() - 0.5) * boundZ * 1.2
        );
    }
    
    // Set rotation
    item.rotation.y = rotation;
    
    // Add to scene
    sceneRef?.add(item);
    placedItems.push(item);
    
    // Enable shadows for all meshes
    item.traverse(child => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    
    return item;
}

/**
 * Add furniture and select it
 */
export function addFurnitureAndSelect(fnName, color, materialType, position = null, rotation = 0) {
    const item = addFurniture(fnName, color, materialType, position, rotation);
    if (item) {
        selectItem(item);
        showToast(`Added ${item.userData.name || 'furniture'}`);
    }
    return item;
}

/**
 * Delete selected furniture
 */
export function deleteSelected() {
    if (!selectedItem) {
        showToast('No item selected');
        return false;
    }
    
    const index = placedItems.indexOf(selectedItem);
    if (index !== -1) placedItems.splice(index, 1);
    
    const name = selectedItem.userData.name || 'Item';
    sceneRef?.remove(selectedItem);
    
    // Clean up geometries and materials
    selectedItem.traverse(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(m => m.dispose());
            } else {
                child.material.dispose();
            }
        }
        if (child.isLight && child.dispose) child.dispose();
    });
    
    selectedItem = null;
    hideSelectionPanel();
    showToast(`Removed ${name}`);
    
    return true;
}

/**
 * Duplicate selected furniture
 */
export function duplicateSelected() {
    if (!selectedItem) {
        showToast('No item selected');
        return null;
    }
    
    const data = selectedItem.userData;
    if (!data || !data.name) {
        showToast('Cannot duplicate this item');
        return null;
    }
    
    // Find the builder function name from userData
    let builderName = null;
    for (const category of Object.values(window.furnitureItems || {})) {
        const found = category.find(item => item.name === data.name);
        if (found) {
            builderName = found.fn;
            break;
        }
    }
    
    if (builderName && builders[builderName]) {
        const newItem = builders[builderName](data.matColor, data.matType);
        newItem.position.copy(selectedItem.position);
        newItem.position.x += 0.6;
        newItem.position.z += 0.4;
        newItem.rotation.y = selectedItem.rotation.y;
        
        sceneRef?.add(newItem);
        placedItems.push(newItem);
        selectItem(newItem);
        showToast(`Duplicated ${data.name}`);
        
        return newItem;
    }
    
    showToast('Cannot duplicate this item');
    return null;
}

/**
 * Clear all furniture from scene
 */
export function clearAllFurniture() {
    placedItems.forEach(item => {
        sceneRef?.remove(item);
        item.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
    });
    placedItems = [];
    selectedItem = null;
    hideSelectionPanel();
}

// ============================================================
// Selection Management
// ============================================================

/**
 * Select a furniture item
 */
export function selectItem(item) {
    // Deselect current
    if (selectedItem) {
        removeSelectionHighlight(selectedItem);
    }
    
    selectedItem = item;
    addSelectionHighlight(selectedItem);
    showSelectionPanel(selectedItem);
    
    // Trigger custom event for UI updates
    window.dispatchEvent(new CustomEvent('itemSelected', { detail: { item: selectedItem } }));
}

/**
 * Deselect all items
 */
export function deselectAll() {
    if (selectedItem) {
        removeSelectionHighlight(selectedItem);
        selectedItem = null;
    }
    hideSelectionPanel();
    window.dispatchEvent(new CustomEvent('itemDeselected'));
}

/**
 * Add selection highlight to item
 */
function addSelectionHighlight(item) {
    item.traverse(child => {
        if (child.isMesh && child.material) {
            // Store original emissive if exists
            if (!child.userData.originalEmissive) {
                if (child.material.emissive) {
                    child.userData.originalEmissive = child.material.emissive.getHex();
                } else {
                    child.userData.originalEmissive = 0x000000;
                }
            }
            if (child.material.emissive) {
                child.material.emissive.setHex(0x442200);
                child.material.emissiveIntensity = 0.3;
            }
            // Add outline effect with scaling? Not ideal for complex models
        }
    });
}

/**
 * Remove selection highlight from item
 */
function removeSelectionHighlight(item) {
    item.traverse(child => {
        if (child.isMesh && child.material) {
            if (child.userData.originalEmissive !== undefined && child.material.emissive) {
                child.material.emissive.setHex(child.userData.originalEmissive);
                child.material.emissiveIntensity = 0;
            }
        }
    });
}

// ============================================================
// UI Panel Management
// ============================================================

/**
 * Show selection panel with item details
 */
function showSelectionPanel(item) {
    const panel = document.getElementById('item-panel');
    const nameEl = document.getElementById('sel-name');
    const descEl = document.getElementById('sel-desc');
    const currentMatEl = document.getElementById('current-mat');
    
    if (panel) panel.classList.remove('hidden');
    if (nameEl) nameEl.textContent = item.userData.name || 'Furniture';
    if (descEl) descEl.textContent = item.userData.desc || '';
    if (currentMatEl) {
        currentMatEl.textContent = `${item.userData.matType || 'fabric'} — ${item.userData.matColor || '#8A8478'}`;
    }
    
    // Update active material type in UI
    const matType = item.userData.matType || 'fabric';
    document.querySelectorAll('#mat-types .mat-type').forEach(el => {
        el.classList.toggle('active', el.textContent.toLowerCase() === matType);
    });
    
    // Update active color swatch
    const color = item.userData.matColor || '#8A8478';
    document.querySelectorAll('#color-swatches .mat-swatch').forEach(el => {
        el.classList.toggle('active', el.title === color);
    });
}

/**
 * Hide selection panel
 */
function hideSelectionPanel() {
    const panel = document.getElementById('item-panel');
    if (panel) panel.classList.add('hidden');
}

// ============================================================
// Material Application
// ============================================================

/**
 * Apply material to selected item
 */
export function applyMaterial(color, materialType) {
    if (!selectedItem) {
        showToast('Select an item first');
        return false;
    }
    
    // Update userData
    selectedItem.userData.matColor = color;
    selectedItem.userData.matType = materialType;
    
    // Create new material
    const newMaterial = createMaterial(color, materialType);
    
    // Apply to all meshes in the group
    let meshIndex = 0;
    selectedItem.traverse(child => {
        if (child.isMesh && child.material && !child.userData.isStructural) {
            const clonedMat = newMaterial.clone();
            if (meshIndex > 0) {
                // Slight variation for realism
                clonedMat.color.offsetHSL(0, 0, (meshIndex % 3) * 0.02);
            }
            // Preserve emissive if it was set for selection
            if (child.userData.originalEmissive) {
                clonedMat.emissive = new THREE.Color(child.userData.originalEmissive);
            }
            child.material.dispose();
            child.material = clonedMat;
            meshIndex++;
        }
    });
    
    // Update UI
    const currentMatEl = document.getElementById('current-mat');
    if (currentMatEl) {
        currentMatEl.textContent = `${materialType} — ${color}`;
    }
    
    showToast(`Applied ${materialType} finish`);
    return true;
}

/**
 * Create material based on type and color
 */
function createMaterial(color, type) {
    const c = new THREE.Color(color);
    switch (type) {
        case 'leather':
            return new THREE.MeshStandardMaterial({ color: c, roughness: 0.45, metalness: 0.08 });
        case 'wood':
            return new THREE.MeshStandardMaterial({ color: c, roughness: 0.65, metalness: 0.02 });
        case 'metal':
            return new THREE.MeshStandardMaterial({ color: c, roughness: 0.25, metalness: 0.85 });
        case 'ceramic':
            return new THREE.MeshStandardMaterial({ color: c, roughness: 0.3, metalness: 0.05 });
        case 'plastic':
            return new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0.1 });
        default: // fabric
            return new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, metalness: 0.01 });
    }
}

// ============================================================
// Rotate Item
// ============================================================

/**
 * Rotate selected item by angle (radians)
 */
export function rotateSelectedItem(angle) {
    if (!selectedItem) {
        showToast('No item selected');
        return false;
    }
    selectedItem.rotation.y += angle;
    return true;
}

/**
 * Raise or lower selected item
 */
export function adjustItemHeight(deltaY) {
    if (!selectedItem) {
        showToast('No item selected');
        return false;
    }
    const newY = Math.max(0, selectedItem.position.y + deltaY);
    selectedItem.position.y = newY;
    return true;
}

// ============================================================
// Data Export/Import
// ============================================================

/**
 * Get all furniture data for saving
 */
export function getAllFurnitureData() {
    return placedItems.map(item => ({
        id: item.userData.id || Math.random().toString(36).substr(2, 9),
        name: item.userData.name,
        desc: item.userData.desc,
        fnName: findBuilderName(item.userData.name),
        color: item.userData.matColor,
        materialType: item.userData.matType,
        position: [item.position.x, item.position.y, item.position.z],
        rotation: item.rotation.y
    }));
}

/**
 * Find builder function name by furniture name
 */
function findBuilderName(name) {
    // This should be populated from data.js
    // For now, return a default mapping
    const nameMap = {
        'Modern Sofa': 'createSofa',
        'Loveseat': 'createLoveseat',
        'Armchair': 'createArmchair',
        'Ottoman': 'createOttoman',
        'Bench': 'createBench',
        'Bean Bag': 'createBeanBag',
        'Coffee Table': 'createCoffeeTable',
        'Side Table': 'createSideTable',
        'Console': 'createConsole',
        'Floor Lamp': 'createFloorLamp',
        'Table Lamp': 'createTableLamp',
        'Bookshelf': 'createBookshelf',
        'Plant': 'createPlant',
        'Rug': 'createRug',
        'TV Stand': 'createTVStand',
        'Wall Art': 'createWallArt',
        'Mirror': 'createMirror',
        'Vase': 'createVase',
        'Wardrobe': 'createWardrobe',
        'Dresser': 'createDresser',
        'Nightstand': 'createNightstand',
        'Chest': 'createChest',
        'Double Bed': 'createDoubleBed',
        'Single Bed': 'createSingleBed',
        'Bunk Bed': 'createBunkBed',
        'Dining Table': 'createDiningTable',
        'Dining Chair': 'createDiningChair',
        'Office Desk': 'createOfficeDesk',
        'Office Chair': 'createOfficeChair'
    };
    return nameMap[name] || 'createSofa';
}

/**
 * Restore furniture from saved data
 */
export function restoreFurnitureFromData(furnitureData, buildersMap) {
    if (!furnitureData || !Array.isArray(furnitureData)) return;
    
    furnitureData.forEach(data => {
        const builder = buildersMap[data.fnName];
        if (builder) {
            const item = builder(data.color, data.materialType);
            if (item) {
                item.position.set(data.position[0], data.position[1], data.position[2]);
                item.rotation.y = data.rotation;
                item.userData.id = data.id;
                sceneRef?.add(item);
                placedItems.push(item);
            }
        }
    });
    
    updateItemCount();
}

// ============================================================
// Utility Functions
// ============================================================

/**
 * Update item count display
 */
export function updateItemCount() {
    const countSpan = document.getElementById('item-count');
    if (countSpan) {
        countSpan.textContent = placedItems.length;
    }
}

/**
 * Get all placed items
 */
export function getPlacedItems() {
    return [...placedItems];
}

/**
 * Get currently selected item
 */
export function getSelectedItem() {
    return selectedItem;
}

/**
 * Set placed items array (for undo/redo)
 */
export function setPlacedItems(items) {
    placedItems = items;
    updateItemCount();
}

// ============================================================
// Cleanup
// ============================================================

/**
 * Clean up event listeners
 */
export function cleanupControls() {
    if (canvasElement) {
        canvasElement.removeEventListener('pointerdown', onPointerDown);
        canvasElement.removeEventListener('pointermove', onPointerMove);
        canvasElement.removeEventListener('pointerup', onPointerUp);
        canvasElement.removeEventListener('click', onClick);
    }
}

// ============================================================
// Export
// ============================================================

console.log('🖱️ Controls module loaded');
