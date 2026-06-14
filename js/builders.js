/**
 * Interior Studio Pro - Furniture Builders
 * Contains all 3D model builder functions for furniture items
 * Each function returns a THREE.Group with the complete model
 */

import * as THREE from 'three';

// ============================================================
// Material Helpers
// ============================================================

function makeMat(color, type) {
    const c = new THREE.Color(color);
    switch (type) {
        case 'leather':
            return new THREE.MeshStandardMaterial({ color: c, roughness: 0.45, metalness: 0.02 });
        case 'wood':
            return new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, metalness: 0 });
        case 'metal':
            return new THREE.MeshStandardMaterial({ color: c, roughness: 0.25, metalness: 0.85 });
        case 'ceramic':
            return new THREE.MeshStandardMaterial({ color: c, roughness: 0.3, metalness: 0.05 });
        case 'plastic':
            return new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0.1 });
        default: // fabric
            return new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, metalness: 0 });
    }
}

const legMat = new THREE.MeshStandardMaterial({ color: 0x3B2F28, roughness: 0.5, metalness: 0.1 });
const legGeo = (h = 0.15, r = 0.025) => new THREE.CylinderGeometry(Math.max(0.01, r), Math.max(0.01, r), Math.max(0.01, h), 8);
const metalMat = new THREE.MeshStandardMaterial({ color: 0xC0C0C0, roughness: 0.3, metalness: 0.85 });

// ============================================================
// SEATING CATEGORY
// ============================================================

export function createSofa(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col, mtype || 'fabric');
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.22, 0.85), m);
    seat.position.y = 0.34;
    seat.castShadow = true;
    seat.receiveShadow = true;
    g.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.55, 0.14), m.clone());
    back.position.set(0, 0.67, -0.36);
    back.castShadow = true;
    g.add(back);
    [-1.0, 1.0].forEach(x => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.85), m.clone());
        arm.position.set(x, 0.52, 0);
        arm.castShadow = true;
        g.add(arm);
    });
    [[-0.9, 0.12, 0.32], [0.9, 0.12, 0.32], [-0.9, 0.12, -0.32], [0.9, 0.12, -0.32]].forEach(p => {
        const l = new THREE.Mesh(legGeo(), legMat);
        l.position.set(...p);
        l.castShadow = true;
        g.add(l);
    });
    const cm = makeMat(col, mtype || 'fabric');
    cm.color.offsetHSL(0, 0, 0.04);
    [-0.52, 0, 0.52].forEach(x => {
        const c = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.08, 0.65), cm);
        c.position.set(x, 0.49, 0.03);
        c.castShadow = true;
        g.add(c);
    });
    [-0.52, 0, 0.52].forEach(x => {
        const c = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 0.1), cm.clone());
        c.position.set(x, 0.62, -0.25);
        c.castShadow = true;
        g.add(c);
    });
    g.userData = { isFurniture: true, name: 'Modern Sofa', desc: '3-seat sofa, 210×90cm', matType: mtype || 'fabric', matColor: col };
    return g;
}

export function createLoveseat(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col, mtype || 'fabric');
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.22, 0.8), m);
    seat.position.y = 0.34;
    seat.castShadow = true;
    g.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 0.12), m.clone());
    back.position.set(0, 0.64, -0.34);
    back.castShadow = true;
    g.add(back);
    [-0.7, 0.7].forEach(x => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.32, 0.8), m.clone());
        arm.position.set(x, 0.5, 0);
        arm.castShadow = true;
        g.add(arm);
    });
    [[-0.62, 0.11, 0.3], [0.62, 0.11, 0.3], [-0.62, 0.11, -0.3], [0.62, 0.11, -0.3]].forEach(p => {
        const l = new THREE.Mesh(legGeo(), legMat);
        l.position.set(...p);
        l.castShadow = true;
        g.add(l);
    });
    g.userData = { isFurniture: true, name: 'Loveseat', desc: '2-seat sofa, 150×85cm', matType: mtype || 'fabric', matColor: col };
    return g;
}

export function createArmchair(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col, mtype || 'fabric');
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.7), m);
    seat.position.y = 0.32;
    seat.castShadow = true;
    g.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.12), m.clone());
    back.position.set(0, 0.62, -0.29);
    back.castShadow = true;
    g.add(back);
    [-0.34, 0.34].forEach(x => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.7), m.clone());
        arm.position.set(x, 0.47, 0);
        arm.castShadow = true;
        g.add(arm);
    });
    [[-0.28, 0.1, 0.28], [0.28, 0.1, 0.28], [-0.28, 0.1, -0.28], [0.28, 0.1, -0.28]].forEach(p => {
        const l = new THREE.Mesh(legGeo(), legMat);
        l.position.set(...p);
        l.castShadow = true;
        g.add(l);
    });
    g.userData = { isFurniture: true, name: 'Armchair', desc: 'Accent chair, 75×80cm', matType: mtype || 'fabric', matColor: col };
    return g;
}

export function createOttoman(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col, mtype || 'fabric');
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.2, 24), m);
    top.position.y = 0.3;
    top.castShadow = true;
    g.add(top);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.25, 0.15, 24), m.clone());
    base.position.y = 0.12;
    base.castShadow = true;
    g.add(base);
    [[-0.18, 0.025, 0.18], [0.18, 0.025, 0.18], [-0.18, 0.025, -0.18], [0.18, 0.025, -0.18]].forEach(p => {
        const l = new THREE.Mesh(legGeo(0.05, 0.02), legMat);
        l.position.set(...p);
        g.add(l);
    });
    g.userData = { isFurniture: true, name: 'Ottoman', desc: 'Round ottoman, ⌀60cm', matType: mtype || 'fabric', matColor: col };
    return g;
}

export function createBench(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col, mtype || 'wood');
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.04, 0.38), m);
    top.position.y = 0.42;
    top.castShadow = true;
    g.add(top);
    [[-0.6, 0.21, 0.13], [0.6, 0.21, 0.13], [-0.6, 0.21, -0.13], [0.6, 0.21, -0.13]].forEach(p => {
        const l = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.04), legMat);
        l.position.set(...p);
        l.castShadow = true;
        g.add(l);
    });
    g.userData = { isFurniture: true, name: 'Bench', desc: 'Wooden bench, 140×40cm', matType: mtype || 'wood', matColor: col };
    return g;
}

export function createBeanBag(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col, mtype || 'fabric');
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.35, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.7), m);
    body.position.y = 0.18;
    body.castShadow = true;
    body.scale.set(1, 0.7, 1);
    g.add(body);
    g.userData = { isFurniture: true, name: 'Bean Bag', desc: 'Casual bean bag, ⌀70cm', matType: mtype || 'fabric', matColor: col };
    return g;
}

export function createChaiseLounge(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col, mtype || 'fabric');
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 0.7), m);
    seat.position.y = 0.3;
    seat.castShadow = true;
    g.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.12), m.clone());
    back.position.set(-0.55, 0.55, 0);
    back.rotation.z = 0.3;
    back.castShadow = true;
    g.add(back);
    const legExt = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.7), m.clone());
    legExt.position.set(0.7, 0.25, 0);
    legExt.castShadow = true;
    g.add(legExt);
    g.userData = { isFurniture: true, name: 'Chaise Lounge', desc: 'Reclining lounge, 160×70cm', matType: mtype || 'fabric', matColor: col };
    return g;
}

export function createBarStool(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col, mtype || 'fabric');
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.08, 16), m);
    seat.position.y = 0.6;
    seat.castShadow = true;
    g.add(seat);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.55, 8), legMat);
    stem.position.y = 0.32;
    stem.castShadow = true;
    g.add(stem);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.03, 12), legMat);
    foot.position.y = 0.045;
    g.add(foot);
    g.userData = { isFurniture: true, name: 'Bar Stool', desc: 'Modern bar stool, 45×65cm', matType: mtype || 'fabric', matColor: col };
    return g;
}

// ============================================================
// TABLES CATEGORY
// ============================================================

export function createCoffeeTable(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col, mtype || 'wood');
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.04, 0.6), m);
    top.position.y = 0.38;
    top.castShadow = true;
    top.receiveShadow = true;
    g.add(top);
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.03, 0.5), m.clone());
    shelf.position.y = 0.1;
    shelf.receiveShadow = true;
    g.add(shelf);
    [[-0.52, 0.19, 0.24], [0.52, 0.19, 0.24], [-0.52, 0.19, -0.24], [0.52, 0.19, -0.24]].forEach(p => {
        const l = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.38, 0.03), legMat);
        l.position.set(...p);
        l.castShadow = true;
        g.add(l);
    });
    g.userData = { isFurniture: true, name: 'Coffee Table', desc: 'Low table, 120×60cm', matType: mtype || 'wood', matColor: col };
    return g;
}

export function createSideTable(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col, mtype || 'wood');
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 20), m);
    top.position.y = 0.5;
    top.castShadow = true;
    g.add(top);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.47, 10), legMat);
    stem.position.y = 0.26;
    stem.castShadow = true;
    g.add(stem);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.02, 16), legMat);
    base.position.y = 0.01;
    g.add(base);
    g.userData = { isFurniture: true, name: 'Side Table', desc: 'Round side table, ⌀45cm', matType: mtype || 'wood', matColor: col };
    return g;
}

export function createConsole(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col, mtype || 'wood');
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.035, 0.35), m);
    top.position.y = 0.72;
    top.castShadow = true;
    g.add(top);
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.025, 0.3), m.clone());
    shelf.position.y = 0.25;
    g.add(shelf);
    [[-0.58, 0.36, 0.13], [0.58, 0.36, 0.13], [-0.58, 0.36, -0.13], [0.58, 0.36, -0.13]].forEach(p => {
        const l = new THREE.Mesh(legGeo(0.72, 0.02), legMat);
        l.position.set(...p);
        l.castShadow = true;
        g.add(l);
    });
    g.userData = { isFurniture: true, name: 'Console', desc: 'Console table, 130×35cm', matType: mtype || 'wood', matColor: col };
    return g;
}

export function createNestingTables(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col, mtype || 'wood');
    [0, 0.35].forEach((offset, i) => {
        const s = 0.5 - i * 0.1;
        const top = new THREE.Mesh(new THREE.CylinderGeometry(s / 2, s / 2, 0.025, 16), m);
        top.position.set(offset, 0.38 - i * 0.08, 0);
        top.castShadow = true;
        g.add(top);
        for (let a = 0; a < 3; a++) {
            const angle = (a / 3) * Math.PI * 2;
            const l = new THREE.Mesh(legGeo(0.35 - i * 0.07, 0.015), legMat);
            l.position.set(offset + Math.cos(angle) * (s / 2 - 0.05), 0.17 - i * 0.04, Math.sin(angle) * (s / 2 - 0.05));
            g.add(l);
        }
    });
    g.userData = { isFurniture: true, name: 'Nesting Tables', desc: 'Set of 2 nesting tables', matType: mtype || 'wood', matColor: col };
    return g;
}

export function createEndTable(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col, mtype || 'wood');
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.5), m);
    top.position.y = 0.52;
    top.castShadow = true;
    g.add(top);
    [[-0.22, 0.26, 0.22], [0.22, 0.26, 0.22], [-0.22, 0.26, -0.22], [0.22, 0.26, -0.22]].forEach(p => {
        const l = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.52, 0.04), legMat);
        l.position.set(...p);
        l.castShadow = true;
        g.add(l);
    });
    g.userData = { isFurniture: true, name: 'End Table', desc: 'Square end table, 50×50cm', matType: mtype || 'wood', matColor: col };
    return g;
}

// ============================================================
// LIGHTING CATEGORY
// ============================================================

export function createFloorLamp(col, mtype) {
    const g = new THREE.Group();
    const metalMatLocal = makeMat(col || '#333', 'metal');
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.03, 16), metalMatLocal);
    base.position.y = 0.015;
    base.castShadow = true;
    g.add(base);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.5, 8), metalMatLocal.clone());
    pole.position.y = 0.78;
    pole.castShadow = true;
    g.add(pole);
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.2, 0.22, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xF5E8D0, roughness: 0.9, side: THREE.DoubleSide }));
    shade.position.y = 1.55;
    shade.castShadow = true;
    g.add(shade);
    const bulb = new THREE.PointLight(0xFFE8C0, 0.6, 5);
    bulb.position.y = 1.5;
    g.add(bulb);
    g.userData = { isFurniture: true, name: 'Floor Lamp', desc: 'Arc floor lamp, h160cm', matType: 'metal', matColor: col || '#333' };
    return g;
}

export function createPendant(col, mtype) {
    const g = new THREE.Group();
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.8, 6), new THREE.MeshStandardMaterial({ color: 0x333 }));
    wire.position.y = 2.2;
    g.add(wire);
    const shade = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), new THREE.MeshStandardMaterial({ color: col || '#C17F4E', roughness: 0.4, metalness: 0.3, side: THREE.DoubleSide }));
    shade.position.y = 1.65;
    shade.castShadow = true;
    g.add(shade);
    const light = new THREE.PointLight(0xFFE0A0, 0.8, 6);
    light.position.y = 1.6;
    g.add(light);
    g.userData = { isFurniture: true, name: 'Pendant Light', desc: 'Hanging pendant', matType: 'metal', matColor: col || '#C17F4E' };
    return g;
}

export function createTableLamp(col, mtype) {
    const g = new THREE.Group();
    const ceramicMat = makeMat(col || '#E8DCC8', 'ceramic');
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.04, 12), ceramicMat);
    base.position.y = 0.02;
    g.add(base);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.28, 12), ceramicMat.clone());
    body.position.y = 0.18;
    body.castShadow = true;
    g.add(body);
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.14, 0.16, 16, 1, true), new THREE.MeshStandardMaterial({ color: 0xFFF5E6, roughness: 0.9, side: THREE.DoubleSide }));
    shade.position.y = 0.4;
    g.add(shade);
    const light = new THREE.PointLight(0xFFE8C0, 0.3, 3);
    light.position.y = 0.38;
    g.add(light);
    g.userData = { isFurniture: true, name: 'Table Lamp', desc: 'Ceramic lamp, h40cm', matType: 'ceramic', matColor: col || '#E8DCC8' };
    return g;
}

export function createWallSconce(col, mtype) {
    const g = new THREE.Group();
    const metalMatLocal = makeMat(col || '#C0C0C0', 'metal');
    const backplate = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16), metalMatLocal);
    backplate.rotation.x = Math.PI / 2;
    backplate.position.z = 0.01;
    g.add(backplate);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.15, 6), metalMatLocal.clone());
    arm.rotation.x = Math.PI / 2;
    arm.position.z = 0.08;
    g.add(arm);
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.1, 0.12, 12, 1, true), new THREE.MeshStandardMaterial({ color: 0xFFF8EE, roughness: 0.8, side: THREE.DoubleSide }));
    shade.position.z = 0.16;
    g.add(shade);
    const light = new THREE.PointLight(0xFFE8C0, 0.3, 3);
    light.position.z = 0.15;
    g.add(light);
    g.userData = { isFurniture: true, name: 'Wall Sconce', desc: 'Wall-mounted light', matType: 'metal', matColor: col || '#C0C0C0' };
    return g;
}

export function createChandelier(col, mtype) {
    const g = new THREE.Group();
    const metalMatLocal = makeMat(col || '#D4AF37', 'metal');
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), metalMatLocal);
    rod.position.y = 2.0;
    g.add(rod);
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16), metalMatLocal);
    center.position.y = 1.7;
    g.add(center);
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 6), metalMatLocal);
        arm.rotation.z = Math.PI / 2;
        arm.position.set(Math.cos(angle) * 0.35, 1.65, Math.sin(angle) * 0.35);
        g.add(arm);
        const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.035, 0.12, 8), new THREE.MeshStandardMaterial({ color: 0xFFF0D0, roughness: 0.2 }));
        candle.position.set(Math.cos(angle) * 0.55, 1.6, Math.sin(angle) * 0.55);
        g.add(candle);
        const light = new THREE.PointLight(0xFFE0A0, 0.3, 4);
        light.position.set(Math.cos(angle) * 0.55, 1.58, Math.sin(angle) * 0.55);
        g.add(light);
    }
    g.userData = { isFurniture: true, name: 'Chandelier', desc: 'Elegant chandelier, ⌀60cm', matType: 'metal', matColor: col || '#D4AF37' };
    return g;
}

export function createLEDStrip(col, mtype) {
    const g = new THREE.Group();
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 1.0), new THREE.MeshStandardMaterial({ color: col || '#FFFFFF', emissive: col || '#FFFFFF', emissiveIntensity: 0.5 }));
    strip.castShadow = false;
    g.add(strip);
    g.userData = { isFurniture: true, name: 'LED Strip', desc: 'Ambient LED strip', matType: 'plastic', matColor: col || '#FFFFFF' };
    return g;
}

// ============================================================
// DECOR CATEGORY
// ============================================================

export function createBookshelf(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#B8956A', 'wood');
    [[-0.38, 0.9, 0], [0.38, 0.9, 0]].forEach(p => {
        const s = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.8, 0.35), m);
        s.position.set(...p);
        s.castShadow = true;
        g.add(s);
    });
    const backP = new THREE.Mesh(new THREE.BoxGeometry(0.76, 1.8, 0.02), m.clone());
    backP.position.set(0, 0.9, -0.165);
    g.add(backP);
    [0.01, 0.45, 0.9, 1.35, 1.79].forEach(y => {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.73, 0.025, 0.33), m.clone());
        shelf.position.set(0, y, 0.005);
        shelf.receiveShadow = true;
        g.add(shelf);
    });
    const bookColors = [0xC17F4E, 0x3D4F5F, 0x7A8B6F, 0x8A8478, 0xC49898];
    [0.23, 0.68, 1.13].forEach((sy, si) => {
        let bx = -0.3;
        for (let i = 0; i < 4 + Math.floor(Math.random() * 3); i++) {
            const bw = 0.03 + Math.random() * 0.04;
            const bh = 0.25 + Math.random() * 0.15;
            const book = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.22), new THREE.MeshStandardMaterial({ color: bookColors[(si + i) % bookColors.length], roughness: 0.8 }));
            book.position.set(bx + bw / 2, sy + bh / 2, 0.01);
            g.add(book);
            bx += bw + 0.005;
            if (bx > 0.28) break;
        }
    });
    g.userData = { isFurniture: true, name: 'Bookshelf', desc: 'Tall shelf, 80×180cm', matType: 'wood', matColor: col || '#B8956A' };
    return g;
}

export function createPlant(col, mtype) {
    const g = new THREE.Group();
    const potMat = new THREE.MeshStandardMaterial({ color: col || '#C4A882', roughness: 0.7 });
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.22, 14), potMat);
    pot.position.y = 0.11;
    pot.castShadow = true;
    g.add(pot);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.015, 8, 14), potMat.clone());
    rim.position.y = 0.22;
    rim.rotation.x = Math.PI / 2;
    g.add(rim);
    const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.02, 14), new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 1 }));
    soil.position.y = 0.22;
    g.add(soil);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x4A7A3F, roughness: 0.8 });
    const leafMat2 = new THREE.MeshStandardMaterial({ color: 0x5C8C4F, roughness: 0.8 });
    for (let i = 0; i < 8; i++) {
        const r = 0.06 + Math.random() * 0.12;
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), i % 2 === 0 ? leafMat : leafMat2);
        leaf.position.set((Math.random() - 0.5) * 0.25, 0.32 + Math.random() * 0.4, (Math.random() - 0.5) * 0.25);
        leaf.castShadow = true;
        g.add(leaf);
    }
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.015, 0.35, 6), new THREE.MeshStandardMaterial({ color: 0x3D5C2E }));
    stem.position.y = 0.38;
    g.add(stem);
    g.userData = { isFurniture: true, name: 'Plant', desc: 'Potted plant, h90cm', matType: 'ceramic', matColor: col || '#C4A882' };
    return g;
}

export function createRug(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#8A8478', 'fabric');
    m.opacity = 0.92;
    m.transparent = true;
    const rug = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.015, 1.4), m);
    rug.position.y = 0.008;
    rug.receiveShadow = true;
    g.add(rug);
    const borderMat = makeMat(col || '#8A8478', 'fabric');
    borderMat.color.offsetHSL(0, -0.1, -0.1);
    [[0, 0.01, 0.68, 2.02, 0.01, 0.04], [0, 0.01, -0.68, 2.02, 0.01, 0.04], [1.0, 0.01, 0, 0.02, 0.01, 1.42], [-1.0, 0.01, 0, 0.02, 0.01, 1.42]].forEach(([x, y, z, w, h2, dd]) => {
        const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.012, dd), borderMat);
        b.position.set(x, y, z);
        g.add(b);
    });
    g.userData = { isFurniture: true, name: 'Rug', desc: 'Area rug, 200×140cm', matType: 'fabric', matColor: col || '#8A8478' };
    return g;
}

export function createTVStand(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#3B3B3B', 'wood');
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, 0.4), m);
    body.position.y = 0.22;
    body.castShadow = true;
    g.add(body);
    const topM = makeMat(col || '#3B3B3B', 'wood');
    topM.color.offsetHSL(0, 0, 0.05);
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.02, 0.42), topM);
    top.position.y = 0.43;
    top.castShadow = true;
    g.add(top);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x2D2D2D, roughness: 0.5 });
    [-0.36, 0.36].forEach(x => {
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.32, 0.01), doorMat);
        door.position.set(x, 0.22, 0.2);
        g.add(door);
    });
    [[-0.7, 0.02, 0.16], [0.7, 0.02, 0.16], [-0.7, 0.02, -0.16], [0.7, 0.02, -0.16]].forEach(p => {
        const l = new THREE.Mesh(legGeo(0.04, 0.02), legMat);
        l.position.set(...p);
        g.add(l);
    });
    const tv = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.04), new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.3, metalness: 0.4 }));
    tv.position.set(0, 0.82, 0);
    tv.castShadow = true;
    g.add(tv);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.12, 0.62), new THREE.MeshStandardMaterial({ color: 0x111122, roughness: 0.1, metalness: 0.2 }));
    screen.position.set(0, 0.82, 0.022);
    g.add(screen);
    g.userData = { isFurniture: true, name: 'TV Stand', desc: 'Media console, 150×50cm', matType: 'wood', matColor: col || '#3B3B3B' };
    return g;
}

export function createWallArt(col, mtype) {
    const g = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: col || '#5C4033', roughness: 0.4, metalness: 0.1 });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.6, 0.03), frameMat);
    frame.castShadow = true;
    g.add(frame);
    const canvasArt = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.5), new THREE.MeshStandardMaterial({ color: 0xE8DCC8, roughness: 0.9, side: THREE.DoubleSide }));
    canvasArt.position.z = 0.017;
    g.add(canvasArt);
    const innerRect = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.25), new THREE.MeshStandardMaterial({ color: 0xC17F4E, roughness: 0.7, side: THREE.DoubleSide }));
    innerRect.position.z = 0.02;
    g.add(innerRect);
    g.userData = { isFurniture: true, name: 'Wall Art', desc: 'Framed artwork, 80×60cm', matType: 'wood', matColor: col || '#5C4033' };
    return g;
}

export function createMirror(col, mtype) {
    const g = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: col || '#C9A96E', roughness: 0.3, metalness: 0.6 });
    const frame = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.03, 8, 24), frameMat);
    frame.position.z = 0.01;
    g.add(frame);
    const glass = new THREE.Mesh(new THREE.CircleGeometry(0.27, 24), new THREE.MeshStandardMaterial({ color: 0xE8F0F8, roughness: 0.05, metalness: 0.95 }));
    glass.position.z = 0.015;
    g.add(glass);
    g.userData = { isFurniture: true, name: 'Mirror', desc: 'Round wall mirror, ⌀60cm', matType: 'metal', matColor: col || '#C9A96E' };
    return g;
}

export function createVase(col, mtype) {
    const g = new THREE.Group();
    const vaseMat = new THREE.MeshStandardMaterial({ color: col || '#C4A882', roughness: 0.5, metalness: 0.1 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.3, 16), vaseMat);
    body.position.y = 0.15;
    body.castShadow = true;
    g.add(body);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.015, 8, 16), vaseMat.clone());
    rim.position.y = 0.3;
    rim.rotation.x = Math.PI / 2;
    g.add(rim);
    for (let i = 0; i < 4; i++) {
        const twig = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.006, 0.2 + Math.random() * 0.2, 6), new THREE.MeshStandardMaterial({ color: 0x5C4033 }));
        twig.position.set((Math.random() - 0.5) * 0.06, 0.35 + Math.random() * 0.15, (Math.random() - 0.5) * 0.06);
        twig.castShadow = true;
        g.add(twig);
    }
    g.userData = { isFurniture: true, name: 'Vase', desc: 'Decorative vase, h35cm', matType: 'ceramic', matColor: col || '#C4A882' };
    return g;
}

export function createCurtains(col, mtype) {
    const g = new THREE.Group();
    const fabricMat = makeMat(col || '#E8DCC8', 'fabric');
    const left = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.2, 0.05), fabricMat);
    left.position.set(-1.2, 1.1, -2.8);
    left.castShadow = true;
    g.add(left);
    const right = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.2, 0.05), fabricMat.clone());
    right.position.set(1.2, 1.1, -2.8);
    right.castShadow = true;
    g.add(right);
    g.userData = { isFurniture: true, name: 'Curtains', desc: 'Floor-length curtains', matType: 'fabric', matColor: col || '#E8DCC8' };
    return g;
}

export function createClock(col, mtype) {
    const g = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: col || '#333333', roughness: 0.3, metalness: 0.7 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 32), frameMat);
    body.rotation.x = Math.PI / 2;
    g.add(body);
    const face = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 32), new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.9 }));
    face.rotation.x = Math.PI / 2;
    face.position.z = 0.015;
    g.add(face);
    g.userData = { isFurniture: true, name: 'Clock', desc: 'Wall clock, ⌀40cm', matType: 'metal', matColor: col || '#333333' };
    return g;
}

// ============================================================
// STORAGE CATEGORY
// ============================================================

export function createWardrobe(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#B8956A', mtype || 'wood');
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.0, 0.5), m);
    body.position.y = 1.0;
    body.castShadow = true;
    body.receiveShadow = true;
    g.add(body);
    const doorMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(col || '#B8956A').multiplyScalar(0.85), roughness: 0.55 });
    [-0.3, 0.3].forEach(x => {
        const door = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.85, 0.02), doorMat);
        door.position.set(x, 1.0, 0.255);
        g.add(door);
        const knob = new THREE.Mesh(new THREE.SphereGeometry(0.015, 8), new THREE.MeshStandardMaterial({ color: 0xC9A96E, roughness: 0.3, metalness: 0.7 }));
        knob.position.set(x + 0.15, 1.1, 0.27);
        g.add(knob);
    });
    g.userData = { isFurniture: true, name: 'Wardrobe', desc: 'Double wardrobe, 120×200cm', matType: mtype || 'wood', matColor: col || '#B8956A' };
    return g;
}

export function createDresser(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#B8956A', mtype || 'wood');
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.85, 0.4), m);
    body.position.y = 0.425;
    body.castShadow = true;
    g.add(body);
    const topM = makeMat(col || '#B8956A', mtype || 'wood');
    topM.color.offsetHSL(0, 0, 0.06);
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.02, 0.42), topM);
    top.position.y = 0.86;
    top.castShadow = true;
    g.add(top);
    for (let r = 0; r < 3; r++) {
        for (let c = -1; c <= 1; c += 2) {
            const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.22, 0.01), new THREE.MeshStandardMaterial({ color: new THREE.Color(col || '#B8956A').multiplyScalar(0.8), roughness: 0.5 }));
            drawer.position.set(c * 0.24, 0.15 + r * 0.25, 0.205);
            g.add(drawer);
            const knob = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8), new THREE.MeshStandardMaterial({ color: 0xC9A96E, roughness: 0.3, metalness: 0.7 }));
            knob.position.set(c * 0.24, 0.15 + r * 0.25, 0.215);
            g.add(knob);
        }
    }
    g.userData = { isFurniture: true, name: 'Dresser', desc: '6-drawer dresser, 100×85cm', matType: mtype || 'wood', matColor: col || '#B8956A' };
    return g;
}

export function createNightstand(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#B8956A', mtype || 'wood');
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.4), m);
    body.position.y = 0.225;
    body.castShadow = true;
    g.add(body);
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.02, 0.42), m.clone());
    top.position.y = 0.46;
    top.castShadow = true;
    g.add(top);
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.18, 0.01), new THREE.MeshStandardMaterial({ color: new THREE.Color(col || '#B8956A').multiplyScalar(0.8), roughness: 0.5 }));
    drawer.position.set(0, 0.28, 0.205);
    g.add(drawer);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8), new THREE.MeshStandardMaterial({ color: 0xC9A96E, roughness: 0.3, metalness: 0.7 }));
    knob.position.set(0, 0.28, 0.215);
    g.add(knob);
    [[-0.2, 0.02, 0.14], [0.2, 0.02, 0.14], [-0.2, 0.02, -0.14], [0.2, 0.02, -0.14]].forEach(p => {
        const l = new THREE.Mesh(legGeo(0.04, 0.02), legMat);
        l.position.set(...p);
        g.add(l);
    });
    g.userData = { isFurniture: true, name: 'Nightstand', desc: 'Bedside table, 50×45cm', matType: mtype || 'wood', matColor: col || '#B8956A' };
    return g;
}

export function createChest(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#B8956A', mtype || 'wood');
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.45), m);
    body.position.y = 0.25;
    body.castShadow = true;
    g.add(body);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.03, 0.47), m.clone());
    lid.position.y = 0.52;
    lid.castShadow = true;
    g.add(lid);
    const latchMat = new THREE.MeshStandardMaterial({ color: 0xC9A96E, roughness: 0.3, metalness: 0.7 });
    const latch = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.03), latchMat);
    latch.position.set(0, 0.535, 0.24);
    g.add(latch);
    g.userData = { isFurniture: true, name: 'Chest', desc: 'Storage chest, 90×50cm', matType: mtype || 'wood', matColor: col || '#B8956A' };
    return g;
}

export function createShoeRack(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#8B5A2B', 'wood');
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.35), m);
    body.position.y = 0.2;
    body.castShadow = true;
    g.add(body);
    for (let i = 0; i < 2; i++) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.02, 0.33), m.clone());
        shelf.position.set(0, 0.1 + i * 0.18, 0);
        g.add(shelf);
    }
    g.userData = { isFurniture: true, name: 'Shoe Rack', desc: 'Shoe storage, 80×40cm', matType: 'wood', matColor: col || '#8B5A2B' };
    return g;
}

// ============================================================
// BEDS CATEGORY
// ============================================================

export function createDoubleBed(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#7A8B6F', mtype || 'fabric');
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.35, 2.1), new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.55 }));
    frame.position.y = 0.18;
    frame.castShadow = true;
    frame.receiveShadow = true;
    g.add(frame);
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.18, 2.0), m);
    mattress.position.y = 0.42;
    mattress.castShadow = true;
    g.add(mattress);
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.7, 0.06), new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.5 }));
    headboard.position.set(0, 0.75, -1.02);
    headboard.castShadow = true;
    g.add(headboard);
    const pillowMat = makeMat('#F0EDE8', 'fabric');
    [-0.45, 0.45].forEach(x => {
        const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.7), pillowMat);
        pillow.position.set(x, 0.55, -0.7);
        pillow.castShadow = true;
        g.add(pillow);
    });
    g.userData = { isFurniture: true, name: 'Double Bed', desc: 'Queen bed, 160×200cm', matType: mtype || 'fabric', matColor: col || '#7A8B6F' };
    return g;
}

export function createSingleBed(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#7A8B6F', mtype || 'fabric');
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.3, 2.1), new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.55 }));
    frame.position.y = 0.15;
    frame.castShadow = true;
    g.add(frame);
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.16, 2.0), m);
    mattress.position.y = 0.38;
    mattress.castShadow = true;
    g.add(mattress);
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.55, 0.05), new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.5 }));
    headboard.position.set(0, 0.6, -1.02);
    headboard.castShadow = true;
    g.add(headboard);
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.07, 0.6), makeMat('#F0EDE8', 'fabric'));
    pillow.position.set(0, 0.5, -0.7);
    pillow.castShadow = true;
    g.add(pillow);
    g.userData = { isFurniture: true, name: 'Single Bed', desc: 'Twin bed, 100×200cm', matType: mtype || 'fabric', matColor: col || '#7A8B6F' };
    return g;
}

export function createBunkBed(col, mtype) {
    const g = new THREE.Group();
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.55 });
    const m = makeMat(col || '#7A8B6F', mtype || 'fabric');
    [[-0.5, 0, -1], [0.5, 0, -1], [-0.5, 0, 1], [0.5, 0, 1]].forEach(([x, _, z]) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.8, 0.06), frameMat);
        post.position.set(x, 0.9, z);
        post.castShadow = true;
        g.add(post);
    });
    const lowFrame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.06, 2.0), frameMat);
    lowFrame.position.y = 0.25;
    g.add(lowFrame);
    const lowMattress = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 1.9), m);
    lowMattress.position.y = 0.33;
    lowMattress.castShadow = true;
    g.add(lowMattress);
    const upFrame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.06, 2.0), frameMat.clone());
    upFrame.position.y = 1.3;
    g.add(upFrame);
    const upMattress = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 1.9), m.clone());
    upMattress.position.y = 1.38;
    upMattress.castShadow = true;
    g.add(upMattress);
    for (let i = 0; i < 4; i++) {
        const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8), frameMat);
        rung.position.set(0.55, 0.35 + i * 0.3, -0.8);
        rung.rotation.z = Math.PI / 2;
        g.add(rung);
    }
    g.userData = { isFurniture: true, name: 'Bunk Bed', desc: 'Bunk bed, 100×200cm', matType: mtype || 'fabric', matColor: col || '#7A8B6F' };
    return g;
}

export function createKingBed(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#6B7D3F', mtype || 'fabric');
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.35, 2.1), new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.55 }));
    frame.position.y = 0.18;
    frame.castShadow = true;
    g.add(frame);
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.18, 2.0), m);
    mattress.position.y = 0.42;
    mattress.castShadow = true;
    g.add(mattress);
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.8, 0.08), new THREE.MeshStandardMaterial({ color: 0x4A3020, roughness: 0.4 }));
    headboard.position.set(0, 0.8, -1.03);
    headboard.castShadow = true;
    g.add(headboard);
    const pillowMat = makeMat('#F0EDE8', 'fabric');
    [-0.55, 0, 0.55].forEach(x => {
        const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.75), pillowMat);
        pillow.position.set(x, 0.55, -0.7);
        pillow.castShadow = true;
        g.add(pillow);
    });
    g.userData = { isFurniture: true, name: 'King Bed', desc: 'King size, 180×200cm', matType: mtype || 'fabric', matColor: col || '#6B7D3F' };
    return g;
}

export function createDaybed(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#8A8478', mtype || 'fabric');
    const base = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 2.0), new THREE.MeshStandardMaterial({ color: 0x5C4033, roughness: 0.55 }));
    base.position.y = 0.15;
    base.castShadow = true;
    g.add(base);
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.12, 1.9), m);
    mattress.position.y = 0.36;
    mattress.castShadow = true;
    g.add(mattress);
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.08), m.clone());
    back.position.set(0, 0.5, -0.98);
    back.castShadow = true;
    g.add(back);
    g.userData = { isFurniture: true, name: 'Daybed', desc: 'Versatile daybed, 120×200cm', matType: mtype || 'fabric', matColor: col || '#8A8478' };
    return g;
}

// ============================================================
// DINING CATEGORY
// ============================================================

export function createDiningTable(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#B8956A', mtype || 'wood');
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.9), m);
    top.position.y = 0.72;
    top.castShadow = true;
    top.receiveShadow = true;
    g.add(top);
    const apron = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.08, 0.8), m.clone());
    apron.position.y = 0.68;
    g.add(apron);
    [[-0.8, 0.36, 0.38], [0.8, 0.36, 0.38], [-0.8, 0.36, -0.38], [0.8, 0.36, -0.38]].forEach(p => {
        const l = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.72, 0.06), legMat);
        l.position.set(...p);
        l.castShadow = true;
        g.add(l);
    });
    g.userData = { isFurniture: true, name: 'Dining Table', desc: 'Rectangular, 180×90cm', matType: mtype || 'wood', matColor: col || '#B8956A' };
    return g;
}

export function createRoundDiningTable(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#B8956A', mtype || 'wood');
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.04, 24), m);
    top.position.y = 0.72;
    top.castShadow = true;
    g.add(top);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.68, 16), legMat);
    stem.position.y = 0.36;
    stem.castShadow = true;
    g.add(stem);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.03, 16), legMat);
    base.position.y = 0.015;
    g.add(base);
    g.userData = { isFurniture: true, name: 'Round Dining Table', desc: 'Round table, ⌀120cm', matType: mtype || 'wood', matColor: col || '#B8956A' };
    return g;
}

export function createDiningChair(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#8A8478', mtype || 'fabric');
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.04, 0.45), m);
    seat.position.y = 0.44;
    seat.castShadow = true;
    g.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.4, 0.03), m.clone());
    back.position.set(0, 0.66, -0.21);
    back.castShadow = true;
    g.add(back);
    [[-0.2, 0.22, 0.2], [0.2, 0.22, 0.2], [-0.2, 0.22, -0.2], [0.2, 0.22, -0.2]].forEach(p => {
        const l = new THREE.Mesh(legGeo(0.44, 0.018), legMat);
        l.position.set(...p);
        l.castShadow = true;
        g.add(l);
    });
    g.userData = { isFurniture: true, name: 'Dining Chair', desc: 'Upholstered chair, 45×50cm', matType: mtype || 'fabric', matColor: col || '#8A8478' };
    return g;
}

export function createDiningBench(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#B8956A', mtype || 'wood');
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.05, 0.35), m);
    top.position.y = 0.42;
    top.castShadow = true;
    g.add(top);
    [[-0.68, 0.21, 0.12], [0.68, 0.21, 0.12], [-0.68, 0.21, -0.12], [0.68, 0.21, -0.12]].forEach(p => {
        const l = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.04), legMat);
        l.position.set(...p);
        l.castShadow = true;
        g.add(l);
    });
    g.userData = { isFurniture: true, name: 'Dining Bench', desc: 'Bench for dining, 150×35cm', matType: mtype || 'wood', matColor: col || '#B8956A' };
    return g;
}

// ============================================================
// DESKS CATEGORY
// ============================================================

export function createOfficeDesk(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#B8956A', mtype || 'wood');
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.03, 0.65), m);
    top.position.y = 0.72;
    top.castShadow = true;
    top.receiveShadow = true;
    g.add(top);
    [[-0.62, 0.36, 0.26], [0.62, 0.36, 0.26], [-0.62, 0.36, -0.26], [0.62, 0.36, -0.26]].forEach(p => {
        const l = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.72, 0.04), legMat);
        l.position.set(...p);
        l.castShadow = true;
        g.add(l);
    });
    const drawerUnit = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.55, 0.6), m.clone());
    drawerUnit.position.set(0.5, 0.29, 0);
    drawerUnit.castShadow = true;
    g.add(drawerUnit);
    g.userData = { isFurniture: true, name: 'Office Desk', desc: 'Work desk, 140×65cm', matType: mtype || 'wood', matColor: col || '#B8956A' };
    return g;
}

export function createStandingDesk(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#B8956A', mtype || 'wood');
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.03, 0.6), m);
    top.position.y = 1.05;
    top.castShadow = true;
    g.add(top);
    [[-0.55, 0.53, 0.24], [0.55, 0.53, 0.24], [-0.55, 0.53, -0.24], [0.55, 0.53, -0.24]].forEach(p => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 1.05, 8), legMat);
        leg.position.set(...p);
        leg.castShadow = true;
        g.add(leg);
    });
    g.userData = { isFurniture: true, name: 'Standing Desk', desc: 'Adjustable desk, 130×60cm', matType: mtype || 'wood', matColor: col || '#B8956A' };
    return g;
}

export function createOfficeChair(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#3D4F5F', mtype || 'fabric');
    const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.06, 16), m);
    seat.position.y = 0.46;
    seat.castShadow = true;
    g.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.04), m.clone());
    back.position.set(0, 0.7, -0.22);
    back.castShadow = true;
    g.add(back);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.4, 8), legMat);
    stem.position.y = 0.22;
    stem.castShadow = true;
    g.add(stem);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.025, 16), legMat);
    base.position.y = 0.02;
    g.add(base);
    for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const caster = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8), new THREE.MeshStandardMaterial({ color: 0x333, roughness: 0.4, metalness: 0.6 }));
        caster.position.set(Math.cos(angle) * 0.2, 0.025, Math.sin(angle) * 0.2);
        g.add(caster);
    }
    g.userData = { isFurniture: true, name: 'Office Chair', desc: 'Ergonomic chair, 55×55cm', matType: mtype || 'fabric', matColor: col || '#3D4F5F' };
    return g;
}

export function createCornerDesk(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#8B5A2B', mtype || 'wood');
    const left = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.03, 0.9), m);
    left.position.set(-0.45, 0.72, -0.45);
    left.castShadow = true;
    g.add(left);
    const right = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.03, 0.9), m.clone());
    right.position.set(0.45, 0.72, -0.45);
    right.castShadow = true;
    g.add(right);
    const corner = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.03, 0.6), m.clone());
    corner.position.set(0, 0.72, -0.9);
    corner.castShadow = true;
    g.add(corner);
    [[-0.85, 0.36, -0.85], [0.85, 0.36, -0.85], [-0.85, 0.36, 0], [0.85, 0.36, 0]].forEach(p => {
        const l = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.72, 0.05), legMat);
        l.position.set(...p);
        l.castShadow = true;
        g.add(l);
    });
    g.userData = { isFurniture: true, name: 'Corner Desk', desc: 'L-shaped desk, 150×150cm', matType: mtype || 'wood', matColor: col || '#8B5A2B' };
    return g;
}

// ============================================================
// ELECTRONICS CATEGORY
// ============================================================

export function createTV(col, mtype) {
    const g = new THREE.Group();
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x1A1A2E, roughness: 0.1, metalness: 0.9, emissive: 0x0A0A1A });
    const tv = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.7, 0.04), screenMat);
    tv.castShadow = true;
    g.add(tv);
    const bezel = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.02, 0.01), new THREE.MeshStandardMaterial({ color: 0x333, metalness: 0.7 }));
    bezel.position.set(0, -0.32, 0.022);
    g.add(bezel);
    g.userData = { isFurniture: true, name: 'TV 55"', desc: '55-inch 4K TV', matType: 'plastic', matColor: col || '#1A1A1A' };
    return g;
}

export function createSpeaker(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#2D2D2D', 'wood');
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.3), m);
    body.castShadow = true;
    g.add(body);
    const grill = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.8, 0.02), new THREE.MeshStandardMaterial({ color: 0x1A1A1A, roughness: 0.8 }));
    grill.position.z = 0.16;
    g.add(grill);
    g.userData = { isFurniture: true, name: 'Floor Speaker', desc: 'Tall speaker, h100cm', matType: 'wood', matColor: col || '#2D2D2D' };
    return g;
}

export function createLaptop(col, mtype) {
    const g = new THREE.Group();
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xC0C0C0, metalness: 0.8 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.25), baseMat);
    base.castShadow = true;
    g.add(base);
    const screen = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.02, 0.23), new THREE.MeshStandardMaterial({ color: 0x333 }));
    screen.position.set(0, 0.16, -0.02);
    screen.rotation.x = -Math.PI / 3;
    screen.castShadow = true;
    g.add(screen);
    const display = new THREE.Mesh(new THREE.PlaneGeometry(0.29, 0.19), new THREE.MeshStandardMaterial({ color: 0x1A2A3A, emissive: 0x0A1A2A }));
    display.position.set(0, 0.16, -0.025);
    display.rotation.x = -Math.PI / 3;
    g.add(display);
    g.userData = { isFurniture: true, name: 'Laptop', desc: 'Notebook on desk', matType: 'metal', matColor: col || '#C0C0C0' };
    return g;
}

export function createSoundbar(col, mtype) {
    const g = new THREE.Group();
    const m = new THREE.MeshStandardMaterial({ color: col || '#1A1A1A', roughness: 0.3, metalness: 0.5 });
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.07, 0.1), m);
    bar.castShadow = true;
    g.add(bar);
    g.userData = { isFurniture: true, name: 'Soundbar', desc: 'TV soundbar', matType: 'plastic', matColor: col || '#1A1A1A' };
    return g;
}

// ============================================================
// KITCHEN CATEGORY
// ============================================================

export function createKitchenIsland(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#B8956A', mtype || 'wood');
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.8), new THREE.MeshStandardMaterial({ color: 0xE8E0D0, roughness: 0.7 }));
    top.position.y = 0.88;
    top.castShadow = true;
    g.add(top);
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.85, 0.7), m);
    body.position.y = 0.425;
    body.castShadow = true;
    g.add(body);
    g.userData = { isFurniture: true, name: 'Kitchen Island', desc: 'Prep island, 120×80cm', matType: mtype || 'wood', matColor: col || '#B8956A' };
    return g;
}

export function createRefrigerator(col, mtype) {
    const g = new THREE.Group();
    const m = new THREE.MeshStandardMaterial({ color: col || '#FFFFFF', roughness: 0.4, metalness: 0.7 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.7, 0.7), m);
    body.position.y = 0.85;
    body.castShadow = true;
    g.add(body);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.03, 0.03), new THREE.MeshStandardMaterial({ color: 0xCCC, metalness: 0.9 }));
    handle.position.set(-0.35, 1.1, 0.36);
    g.add(handle);
    g.userData = { isFurniture: true, name: 'Refrigerator', desc: 'Double door fridge', matType: 'metal', matColor: col || '#FFFFFF' };
    return g;
}

export function createSmallDiningTable(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#B8956A', mtype || 'wood');
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.04, 0.8), m);
    top.position.y = 0.72;
    top.castShadow = true;
    g.add(top);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.68, 8), legMat);
    stem.position.y = 0.36;
    g.add(stem);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.03, 12), legMat);
    base.position.y = 0.015;
    g.add(base);
    g.userData = { isFurniture: true, name: 'Small Dining Table', desc: 'Small kitchen table', matType: mtype || 'wood', matColor: col || '#B8956A' };
    return g;
}

// ============================================================
// BATHROOM CATEGORY
// ============================================================

export function createBathtub(col, mtype) {
    const g = new THREE.Group();
    const m = new THREE.MeshStandardMaterial({ color: col || '#FFFFFF', roughness: 0.3, metalness: 0.1 });
    const tub = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 0.7), m);
    tub.position.y = 0.225;
    tub.castShadow = true;
    g.add(tub);
    const inner = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.35, 0.6), new THREE.MeshStandardMaterial({ color: 0xE8F0F5, roughness: 0.2 }));
    inner.position.y = 0.45;
    inner.castShadow = true;
    g.add(inner);
    const legs = [[-0.65, 0.05, -0.3], [0.65, 0.05, -0.3], [-0.65, 0.05, 0.3], [0.65, 0.05, 0.3]];
    legs.forEach(p => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.1, 8), metalMat);
        leg.position.set(...p);
        g.add(leg);
    });
    g.userData = { isFurniture: true, name: 'Bathtub', desc: 'Freestanding tub', matType: 'ceramic', matColor: col || '#FFFFFF' };
    return g;
}

export function createVanity(col, mtype) {
    const g = new THREE.Group();
    const m = makeMat(col || '#B8956A', mtype || 'wood');
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.5), m);
    body.position.y = 0.4;
    body.castShadow = true;
    g.add(body);
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.05, 0.55), new THREE.MeshStandardMaterial({ color: 0xE8E8E8, roughness: 0.2 }));
    top.position.y = 0.825;
    top.castShadow = true;
    g.add(top);
    const sink = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.08, 24), new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.1, metalness: 0.9 }));
    sink.position.y = 0.85;
    g.add(sink);
    g.userData = { isFurniture: true, name: 'Vanity', desc: 'Bathroom vanity', matType: mtype || 'wood', matColor: col || '#B8956A' };
    return g;
}

// ============================================================
// Export all builders as a single object
// ============================================================

export const builders = {
    createSofa,
    createLoveseat,
    createArmchair,
    createOttoman,
    createBench,
    createBeanBag,
    createChaiseLounge,
    createBarStool,
    createCoffeeTable,
    createSideTable,
    createConsole,
    createNestingTables,
    createEndTable,
    createFloorLamp,
    createPendant,
    createTableLamp,
    createWallSconce,
    createChandelier,
    createLEDStrip,
    createBookshelf,
    createPlant,
    createRug,
    createTVStand,
    createWallArt,
    createMirror,
    createVase,
    createCurtains,
    createClock,
    createWardrobe,
    createDresser,
    createNightstand,
    createChest,
    createShoeRack,
    createDoubleBed,
    createSingleBed,
    createBunkBed,
    createKingBed,
    createDaybed,
    createDiningTable,
    createRoundDiningTable,
    createDiningChair,
    createDiningBench,
    createOfficeDesk,
    createStandingDesk,
    createOfficeChair,
    createCornerDesk,
    createTV,
    createSpeaker,
    createLaptop,
    createSoundbar,
    createKitchenIsland,
    createRefrigerator,
    createSmallDiningTable,
    createBathtub,
    createVanity
};

console.log(`🛋️ ${Object.keys(builders).length} furniture builders loaded`);
