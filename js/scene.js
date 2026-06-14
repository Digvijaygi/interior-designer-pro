/**
 * Interior Studio Pro - Scene Manager
 * Handles Three.js initialization, lighting, room building, and scene management
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============================================================
// Scene Variables
// ============================================================

let scene = null;
let camera = null;
let renderer = null;
let controls = null;
let roomGroup = null;
let currentLights = {
    ambient: null,
    hemi: null,
    directional: null,
    fill: null,
    back: null
};
let currentWireframeMode = false;
let gridHelper = null;
let currentRoomDimensions = { width: 8, depth: 6, height: 3 };
let currentWallColor = '#FAF8F4';

// ============================================================
// Texture Generators
// ============================================================

/**
 * Creates a procedural wood texture for the floor
 */
function makeWoodTexture(width, depth) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    
    // Base color
    ctx.fillStyle = '#B8956A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Wood grain lines
    for (let i = 0; i < 200; i++) {
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.strokeStyle = `rgba(90, 60, 30, ${Math.random() * 0.15})`;
        ctx.lineWidth = Math.random() * 3 + 0.5;
        
        for (let x = 0; x < canvas.width; x += 20) {
            const waveY = y + Math.sin(x * 0.008 + i) * 8;
            ctx.lineTo(x, waveY);
        }
        ctx.stroke();
    }
    
    // Knots
    for (let k = 0; k < 15; k++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.ellipse(x, y, 12, 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(70, 45, 20, 0.3)`;
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(x, y, 6, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(50, 30, 10, 0.5)`;
        ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(width / 2.5, depth / 2.5);
    
    return texture;
}

/**
 * Creates a procedural concrete texture for walls
 */
function makeWallTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#E8E2D8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < 800; i++) {
        ctx.fillStyle = `rgba(100, 80, 60, ${Math.random() * 0.08})`;
        ctx.fillRect(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 3 + 1,
            Math.random() * 3 + 1
        );
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 2);
    
    return texture;
}

// ============================================================
// Room Builder
// ============================================================

/**
 * Builds the complete room model
 */
export function buildRoom() {
    if (!roomGroup) {
        roomGroup = new THREE.Group();
        scene.add(roomGroup);
    }
    
    // Clear existing room
    while (roomGroup.children.length) {
        const child = roomGroup.children[0];
        if (child.isMesh && child.geometry) child.geometry.dispose();
        if (child.isMesh && child.material) {
            if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
            else child.material.dispose();
        }
        roomGroup.remove(child);
    }
    
    const w = currentRoomDimensions.width;
    const d = currentRoomDimensions.depth;
    const h = currentRoomDimensions.height;
    
    // Floor
    const floorMat = new THREE.MeshStandardMaterial({ 
        map: makeWoodTexture(w, d), 
        roughness: 0.65, 
        metalness: 0.05,
        side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, d), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    floor.name = 'floor';
    roomGroup.add(floor);
    
    // Base floor plane for shadows
    const shadowReceiver = new THREE.Mesh(
        new THREE.PlaneGeometry(w, d),
        new THREE.ShadowMaterial({ opacity: 0.3, color: 0x000000, transparent: true, side: THREE.DoubleSide })
    );
    shadowReceiver.rotation.x = -Math.PI / 2;
    shadowReceiver.position.y = 0.001;
    shadowReceiver.receiveShadow = true;
    roomGroup.add(shadowReceiver);
    
    // Wall material
    const wallMat = new THREE.MeshStandardMaterial({ color: currentWallColor, roughness: 0.85, metalness: 0.01 });
    
    // Back wall
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.1), wallMat);
    backWall.position.set(0, h / 2, -d / 2);
    backWall.receiveShadow = true;
    backWall.castShadow = true;
    backWall.name = 'backWall';
    roomGroup.add(backWall);
    
    // Left wall
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, d), wallMat.clone());
    leftWall.position.set(-w / 2, h / 2, 0);
    leftWall.receiveShadow = true;
    leftWall.castShadow = true;
    roomGroup.add(leftWall);
    
    // Right wall
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, d), wallMat.clone());
    rightWall.position.set(w / 2, h / 2, 0);
    rightWall.receiveShadow = true;
    rightWall.castShadow = true;
    roomGroup.add(rightWall);
    
    // Front wall (semi-transparent for camera view)
    const frontWallMat = new THREE.MeshStandardMaterial({ 
        color: currentWallColor, 
        roughness: 0.85, 
        transparent: true, 
        opacity: 0.08,
        side: THREE.DoubleSide 
    });
    const frontWall = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), frontWallMat);
    frontWall.position.set(0, h / 2, d / 2);
    frontWall.receiveShadow = false;
    frontWall.castShadow = false;
    roomGroup.add(frontWall);
    
    // Ceiling
    const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xFFFFF8, roughness: 0.9, metalness: 0.01 });
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(w, d), ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = h;
    ceiling.receiveShadow = false;
    ceiling.castShadow = false;
    roomGroup.add(ceiling);
    
    // Baseboards
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xF0E8D8, roughness: 0.6 });
    const baseHeight = 0.08;
    
    const baseFront = new THREE.Mesh(new THREE.BoxGeometry(w, baseHeight, 0.02), baseMat);
    baseFront.position.set(0, baseHeight / 2, -d / 2 + 0.02);
    roomGroup.add(baseFront);
    
    const baseBack = new THREE.Mesh(new THREE.BoxGeometry(w, baseHeight, 0.02), baseMat.clone());
    baseBack.position.set(0, baseHeight / 2, d / 2 - 0.02);
    roomGroup.add(baseBack);
    
    const baseLeft = new THREE.Mesh(new THREE.BoxGeometry(0.02, baseHeight, d), baseMat.clone());
    baseLeft.position.set(-w / 2 + 0.02, baseHeight / 2, 0);
    roomGroup.add(baseLeft);
    
    const baseRight = new THREE.Mesh(new THREE.BoxGeometry(0.02, baseHeight, d), baseMat.clone());
    baseRight.position.set(w / 2 - 0.02, baseHeight / 2, 0);
    roomGroup.add(baseRight);
    
    // Window on back wall
    addWindowToWall(w, d, h);
    
    // Ceiling spots / can lights
    addCeilingLights(w, d, h);
    
    // Grid helper
    if (gridHelper) roomGroup.remove(gridHelper);
    gridHelper = new THREE.GridHelper(Math.max(w, d) * 1.5, 24, 0xCCBBAA, 0xDDD4C8);
    gridHelper.position.y = 0.003;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.25;
    roomGroup.add(gridHelper);
    
    // Update camera target to center of room
    if (controls) {
        controls.target.set(0, h / 2, 0);
        controls.update();
    }
}

/**
 * Adds a window to the back wall
 */
function addWindowToWall(w, d, h) {
    const winW = Math.min(w * 0.35, 2.8);
    const winH = Math.min(h * 0.5, 1.6);
    const winY = h * 0.65;
    const winX = w * 0.2;
    
    // Window frame outer
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xDDD8D0, roughness: 0.5 });
    const frameOuter = new THREE.Mesh(new THREE.BoxGeometry(winW + 0.12, winH + 0.12, 0.08), frameMat);
    frameOuter.position.set(-winX, winY, -d / 2 + 0.03);
    frameOuter.castShadow = true;
    roomGroup.add(frameOuter);
    
    // Glass
    const glassMat = new THREE.MeshStandardMaterial({ 
        color: 0xA8D0E8, 
        emissive: 0x4A8AB0, 
        emissiveIntensity: 0.15,
        roughness: 0.1, 
        metalness: 0.9,
        transparent: true,
        opacity: 0.7
    });
    const glass = new THREE.Mesh(new THREE.BoxGeometry(winW, winH, 0.02), glassMat);
    glass.position.set(-winX, winY, -d / 2 + 0.06);
    glass.castShadow = false;
    roomGroup.add(glass);
    
    // Window cross bars
    const barMat = new THREE.MeshStandardMaterial({ color: 0xDDD8D0, roughness: 0.5 });
    const verticalBar = new THREE.Mesh(new THREE.BoxGeometry(0.04, winH, 0.06), barMat);
    verticalBar.position.set(-winX, winY, -d / 2 + 0.05);
    roomGroup.add(verticalBar);
    
    const horizontalBar = new THREE.Mesh(new THREE.BoxGeometry(winW, 0.04, 0.06), barMat);
    horizontalBar.position.set(-winX, winY, -d / 2 + 0.05);
    roomGroup.add(horizontalBar);
    
    // Window sill
    const sill = new THREE.Mesh(new THREE.BoxGeometry(winW + 0.2, 0.06, 0.15), frameMat);
    sill.position.set(-winX, winY - winH / 2 - 0.03, -d / 2 + 0.08);
    roomGroup.add(sill);
}

/**
 * Adds ceiling can lights / spotlights
 */
function addCeilingLights(w, d, h) {
    const positions = [
        [-w * 0.25, h - 0.02, -d * 0.25],
        [w * 0.25, h - 0.02, -d * 0.25],
        [-w * 0.25, h - 0.02, d * 0.25],
        [w * 0.25, h - 0.02, d * 0.25],
        [0, h - 0.02, 0]
    ];
    
    positions.forEach(pos => {
        const canLight = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.14, 0.03, 16),
            new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.3, metalness: 0.7 })
        );
        canLight.position.set(pos[0], pos[1], pos[2]);
        canLight.castShadow = false;
        roomGroup.add(canLight);
        
        // Light source
        const pointLight = new THREE.PointLight(0xFFEED0, 0.35, 6);
        pointLight.position.set(pos[0], h - 0.1, pos[2]);
        pointLight.castShadow = false;
        roomGroup.add(pointLight);
    });
}

// ============================================================
// Lighting Presets
// ============================================================

/**
 * Updates lighting based on preset (day, evening, night)
 */
export function updateLightingPreset(preset) {
    if (!scene) return;
    
    const lights = currentLights;
    
    switch (preset) {
        case 'day':
            if (lights.ambient) lights.ambient.intensity = 0.55;
            if (lights.hemi) lights.hemi.intensity = 0.45;
            if (lights.directional) {
                lights.directional.intensity = 1.6;
                lights.directional.position.set(4, 8, 5);
            }
            if (lights.fill) lights.fill.intensity = 0.35;
            if (lights.back) lights.back.intensity = 0.25;
            scene.background = new THREE.Color(0xF5F0E8);
            scene.fog.color = new THREE.Color(0xF5F0E8);
            break;
            
        case 'evening':
            if (lights.ambient) lights.ambient.intensity = 0.35;
            if (lights.hemi) lights.hemi.intensity = 0.25;
            if (lights.directional) {
                lights.directional.intensity = 0.8;
                lights.directional.position.set(2, 3, 4);
                lights.directional.color.setHex(0xFFAA66);
            }
            if (lights.fill) lights.fill.intensity = 0.2;
            if (lights.back) lights.back.intensity = 0.15;
            scene.background = new THREE.Color(0xE8D8C8);
            scene.fog.color = new THREE.Color(0xE8D8C8);
            scene.fog.density = 0.02;
            break;
            
        case 'night':
            if (lights.ambient) lights.ambient.intensity = 0.12;
            if (lights.hemi) lights.hemi.intensity = 0.08;
            if (lights.directional) {
                lights.directional.intensity = 0.2;
                lights.directional.position.set(1, 2, 2);
                lights.directional.color.setHex(0x6688AA);
            }
            if (lights.fill) lights.fill.intensity = 0.08;
            if (lights.back) lights.back.intensity = 0.05;
            scene.background = new THREE.Color(0x1A1A2E);
            scene.fog.color = new THREE.Color(0x1A1A2E);
            scene.fog.density = 0.025;
            break;
    }
}

// ============================================================
// Wall Color Management
// ============================================================

/**
 * Changes wall color
 */
export function setWallColor(color, sceneRef) {
    currentWallColor = color;
    if (!roomGroup) return;
    
    roomGroup.children.forEach(child => {
        if (child.name === 'backWall' || child.name === 'leftWall' || child.name === 'rightWall') {
            if (child.material) {
                child.material.color.setHex(parseInt(color.slice(1), 16));
            }
        }
        // Also update front wall material
        if (child.material && child.material.transparent && child.material.opacity < 0.1) {
            child.material.color.setHex(parseInt(color.slice(1), 16));
        }
    });
}

// ============================================================
// Wireframe and Grid Toggles
// ============================================================

/**
 * Toggles wireframe mode for all meshes
 */
export function setWireframeMode(sceneRef) {
    currentWireframeMode = !currentWireframeMode;
    
    const toggleWireframe = (obj) => {
        if (obj.isMesh && obj.material && obj.name !== 'gridHelper') {
            if (Array.isArray(obj.material)) {
                obj.material.forEach(m => { if (m) m.wireframe = currentWireframeMode; });
            } else {
                obj.material.wireframe = currentWireframeMode;
            }
        }
        if (obj.children) obj.children.forEach(child => toggleWireframe(child));
    };
    
    if (sceneRef) toggleWireframe(sceneRef);
    return currentWireframeMode;
}

/**
 * Toggles grid helper visibility
 */
export function toggleGrid(sceneRef) {
    if (gridHelper) {
        gridHelper.visible = !gridHelper.visible;
    }
    return gridHelper ? gridHelper.visible : false;
}

// ============================================================
// Scene Initialization
// ============================================================

/**
 * Initializes the Three.js scene, camera, renderer, and controls
 */
export async function initScene() {
    // Get canvas element
    const canvas = document.getElementById('viewer-canvas');
    if (!canvas) {
        throw new Error('Canvas element not found');
    }
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF5F0E8);
    scene.fog = new THREE.FogExp2(0xF5F0E8, 0.012);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(7, 5.5, 9);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    // Create controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minDistance = 1.5;
    controls.maxDistance = 22;
    controls.target.set(0, 1.5, 0);
    
    // Setup lighting
    setupLighting();
    
    // Build initial room
    roomGroup = new THREE.Group();
    scene.add(roomGroup);
    buildRoom();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Set initial dimensions from room type
    const rt = { w: 8, d: 6, h: 3 };
    currentRoomDimensions = { width: rt.w, depth: rt.d, height: rt.h };
    
    return { scene, camera, renderer, controls };
}

/**
 * Sets up all lighting in the scene
 */
function setupLighting() {
    // Ambient light
    currentLights.ambient = new THREE.AmbientLight(0xFFE8D0, 0.55);
    scene.add(currentLights.ambient);
    
    // Hemisphere light
    currentLights.hemi = new THREE.HemisphereLight(0xFFF5E6, 0x8B7355, 0.45);
    scene.add(currentLights.hemi);
    
    // Main directional light (sun)
    currentLights.directional = new THREE.DirectionalLight(0xFFF0D8, 1.6);
    currentLights.directional.position.set(4, 8, 5);
    currentLights.directional.castShadow = true;
    currentLights.directional.receiveShadow = false;
    currentLights.directional.shadow.mapSize.set(2048, 2048);
    currentLights.directional.shadow.camera.left = -10;
    currentLights.directional.shadow.camera.right = 10;
    currentLights.directional.shadow.camera.top = 10;
    currentLights.directional.shadow.camera.bottom = -10;
    currentLights.directional.shadow.camera.near = 0.5;
    currentLights.directional.shadow.camera.far = 30;
    currentLights.directional.shadow.bias = -0.0001;
    scene.add(currentLights.directional);
    
    // Fill light
    currentLights.fill = new THREE.DirectionalLight(0xE0E8F0, 0.35);
    currentLights.fill.position.set(-3, 4, -4);
    scene.add(currentLights.fill);
    
    // Back rim light
    currentLights.back = new THREE.PointLight(0xFFAA88, 0.25);
    currentLights.back.position.set(0, 2.5, -4);
    scene.add(currentLights.back);
    
    // Small fill from below
    const fillBottom = new THREE.PointLight(0xCCAA88, 0.15);
    fillBottom.position.set(0, -1, 0);
    scene.add(fillBottom);
    
    // Optional: Add shadow helper visualization (debug only)
    // scene.add(new THREE.CameraHelper(currentLights.directional.shadow.camera));
}

// ============================================================
// Window Resize Handler
// ============================================================

function onWindowResize() {
    if (!camera || !renderer) return;
    
    const container = document.querySelector('main');
    const width = container ? container.clientWidth : window.innerWidth;
    const height = container ? container.clientHeight : window.innerHeight;
    
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

// ============================================================
// Public Getters
// ============================================================

export function getScene() { return scene; }
export function getCamera() { return camera; }
export function getRenderer() { return renderer; }
export function getControls() { return controls; }
export function getRoomGroup() { return roomGroup; }
export function getCurrentRoomDimensions() { return { ...currentRoomDimensions }; }

/**
 * Updates room dimensions and rebuilds room
 */
export function updateRoomDimensions(width, depth, height) {
    if (width !== undefined) currentRoomDimensions.width = width;
    if (depth !== undefined) currentRoomDimensions.depth = depth;
    if (height !== undefined) currentRoomDimensions.height = height;
    
    buildRoom();
}

/**
 * Shows/hides the grid helper
 */
export function setGridVisible(visible) {
    if (gridHelper) gridHelper.visible = visible;
}

/**
 * Gets current wireframe mode state
 */
export function isWireframeMode() {
    return currentWireframeMode;
}

// ============================================================
// Export all functions
// ============================================================

console.log('🎬 Scene module loaded');
