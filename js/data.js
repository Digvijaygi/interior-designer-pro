/**
 * Interior Studio Pro - Data Layer
 * Contains all room types, furniture categories, items, materials, and presets
 * Easily extendable — add new items, rooms, or categories here
 */

// ============================================================
// Room Types
// ============================================================
export const roomTypes = [
    { id: 'living', label: 'Living Room', icon: 'fa-couch', w: 8, d: 6, h: 3, wallCol: '#FAF8F4' },
    { id: 'bedroom', label: 'Bedroom', icon: 'fa-bed', w: 7, d: 5.5, h: 2.8, wallCol: '#E8E2D8' },
    { id: 'dining', label: 'Dining Room', icon: 'fa-utensils', w: 7, d: 6, h: 3, wallCol: '#FAF8F4' },
    { id: 'office', label: 'Home Office', icon: 'fa-desktop', w: 6, d: 5, h: 2.8, wallCol: '#D5DEE0' },
    { id: 'kids', label: 'Kids Room', icon: 'fa-child', w: 6, d: 5.5, h: 2.7, wallCol: '#E8DFD5' },
    { id: 'lobby', label: 'Lobby / Hall', icon: 'fa-building', w: 10, d: 7, h: 3.5, wallCol: '#FFFFFF' },
    { id: 'kitchen', label: 'Kitchen', icon: 'fa-kitchen-set', w: 6, d: 5, h: 2.8, wallCol: '#F5F0E8' },
    { id: 'bathroom', label: 'Bathroom', icon: 'fa-bath', w: 4, d: 4, h: 2.6, wallCol: '#E8F0F0' },
    { id: 'studio', label: 'Studio Apartment', icon: 'fa-building', w: 9, d: 7, h: 3.2, wallCol: '#FAFAFA' }
];

// ============================================================
// Category Map (per room type for dynamic filtering)
// ============================================================
export const categoryMap = {
    living: [
        { id: 'seating', label: 'Seating', icon: 'fa-couch' },
        { id: 'tables', label: 'Tables', icon: 'fa-table' },
        { id: 'lighting', label: 'Lighting', icon: 'fa-lightbulb' },
        { id: 'decor', label: 'Decor', icon: 'fa-leaf' },
        { id: 'storage', label: 'Storage', icon: 'fa-box' },
        { id: 'electronics', label: 'Electronics', icon: 'fa-tv' }
    ],
    bedroom: [
        { id: 'beds', label: 'Beds', icon: 'fa-bed' },
        { id: 'storage', label: 'Storage', icon: 'fa-box' },
        { id: 'seating', label: 'Seating', icon: 'fa-chair' },
        { id: 'tables', label: 'Tables', icon: 'fa-table' },
        { id: 'lighting', label: 'Lighting', icon: 'fa-lightbulb' },
        { id: 'decor', label: 'Decor', icon: 'fa-leaf' }
    ],
    dining: [
        { id: 'dining', label: 'Dining Set', icon: 'fa-utensils' },
        { id: 'seating', label: 'Seating', icon: 'fa-chair' },
        { id: 'storage', label: 'Storage', icon: 'fa-box' },
        { id: 'lighting', label: 'Lighting', icon: 'fa-lightbulb' },
        { id: 'decor', label: 'Decor', icon: 'fa-leaf' },
        { id: 'tables', label: 'Side Tables', icon: 'fa-table' }
    ],
    office: [
        { id: 'desks', label: 'Desks', icon: 'fa-desktop' },
        { id: 'seating', label: 'Seating', icon: 'fa-chair' },
        { id: 'storage', label: 'Storage', icon: 'fa-box' },
        { id: 'lighting', label: 'Lighting', icon: 'fa-lightbulb' },
        { id: 'decor', label: 'Decor', icon: 'fa-leaf' },
        { id: 'tables', label: 'Tables', icon: 'fa-table' },
        { id: 'electronics', label: 'Electronics', icon: 'fa-laptop' }
    ],
    kids: [
        { id: 'beds', label: 'Beds', icon: 'fa-bed' },
        { id: 'storage', label: 'Storage', icon: 'fa-box' },
        { id: 'seating', label: 'Seating', icon: 'fa-chair' },
        { id: 'tables', label: 'Tables', icon: 'fa-table' },
        { id: 'lighting', label: 'Lighting', icon: 'fa-lightbulb' },
        { id: 'decor', label: 'Decor', icon: 'fa-star' }
    ],
    lobby: [
        { id: 'seating', label: 'Seating', icon: 'fa-couch' },
        { id: 'tables', label: 'Tables', icon: 'fa-table' },
        { id: 'decor', label: 'Decor', icon: 'fa-leaf' },
        { id: 'lighting', label: 'Lighting', icon: 'fa-lightbulb' },
        { id: 'storage', label: 'Storage', icon: 'fa-box' }
    ],
    kitchen: [
        { id: 'kitchen', label: 'Kitchen', icon: 'fa-kitchen-set' },
        { id: 'seating', label: 'Seating', icon: 'fa-chair' },
        { id: 'storage', label: 'Storage', icon: 'fa-box' },
        { id: 'lighting', label: 'Lighting', icon: 'fa-lightbulb' },
        { id: 'tables', label: 'Tables', icon: 'fa-table' }
    ],
    bathroom: [
        { id: 'bathroom', label: 'Bathroom', icon: 'fa-bath' },
        { id: 'storage', label: 'Storage', icon: 'fa-box' },
        { id: 'lighting', label: 'Lighting', icon: 'fa-lightbulb' }
    ],
    studio: [
        { id: 'seating', label: 'Seating', icon: 'fa-couch' },
        { id: 'beds', label: 'Beds', icon: 'fa-bed' },
        { id: 'tables', label: 'Tables', icon: 'fa-table' },
        { id: 'storage', label: 'Storage', icon: 'fa-box' },
        { id: 'lighting', label: 'Lighting', icon: 'fa-lightbulb' },
        { id: 'decor', label: 'Decor', icon: 'fa-leaf' },
        { id: 'desks', label: 'Desks', icon: 'fa-desktop' }
    ]
};

// ============================================================
// Furniture Items (all items across all categories)
// To add a new item: add entry here + create builder function in builders.js
// ============================================================
export const furnitureItems = {
    // Seating
    seating: [
        { name: 'Modern Sofa', desc: '3-seat sofa, 210×90cm', icon: 'fa-couch', fn: 'createSofa', defaultColor: '#7A8B6F', defaultMat: 'fabric' },
        { name: 'Loveseat', desc: '2-seat sofa, 150×85cm', icon: 'fa-couch', fn: 'createLoveseat', defaultColor: '#8A8478', defaultMat: 'fabric' },
        { name: 'Armchair', desc: 'Accent chair, 75×80cm', icon: 'fa-chair', fn: 'createArmchair', defaultColor: '#C17F59', defaultMat: 'fabric' },
        { name: 'Ottoman', desc: 'Round ottoman, ⌀60cm', icon: 'fa-circle', fn: 'createOttoman', defaultColor: '#8A8478', defaultMat: 'fabric' },
        { name: 'Bench', desc: 'Wooden bench, 140×40cm', icon: 'fa-minus', fn: 'createBench', defaultColor: '#B8956A', defaultMat: 'wood' },
        { name: 'Bean Bag', desc: 'Casual bean bag, ⌀70cm', icon: 'fa-circle', fn: 'createBeanBag', defaultColor: '#C17F59', defaultMat: 'fabric' },
        { name: 'Chaise Lounge', desc: 'Reclining lounge, 160×70cm', icon: 'fa-couch', fn: 'createChaiseLounge', defaultColor: '#5C8A6F', defaultMat: 'fabric' },
        { name: 'Bar Stool', desc: 'Modern bar stool, 45×65cm', icon: 'fa-chair', fn: 'createBarStool', defaultColor: '#3D4F5F', defaultMat: 'fabric' }
    ],
    // Tables
    tables: [
        { name: 'Coffee Table', desc: 'Low table, 120×60cm', icon: 'fa-table', fn: 'createCoffeeTable', defaultColor: '#B8956A', defaultMat: 'wood' },
        { name: 'Side Table', desc: 'Round side table, ⌀45cm', icon: 'fa-border-all', fn: 'createSideTable', defaultColor: '#B8956A', defaultMat: 'wood' },
        { name: 'Console', desc: 'Console table, 130×35cm', icon: 'fa-minus', fn: 'createConsole', defaultColor: '#5C4033', defaultMat: 'wood' },
        { name: 'Nesting Tables', desc: 'Set of 2 nesting tables', icon: 'fa-layer-group', fn: 'createNestingTables', defaultColor: '#B8956A', defaultMat: 'wood' },
        { name: 'End Table', desc: 'Square end table, 50×50cm', icon: 'fa-border-all', fn: 'createEndTable', defaultColor: '#8B5A2B', defaultMat: 'wood' }
    ],
    // Lighting
    lighting: [
        { name: 'Floor Lamp', desc: 'Arc floor lamp, h160cm', icon: 'fa-lightbulb', fn: 'createFloorLamp', defaultColor: '#333333', defaultMat: 'metal' },
        { name: 'Pendant Light', desc: 'Hanging pendant, warm glow', icon: 'fa-circle', fn: 'createPendant', defaultColor: '#C17F4E', defaultMat: 'metal' },
        { name: 'Table Lamp', desc: 'Ceramic lamp, h40cm', icon: 'fa-lightbulb', fn: 'createTableLamp', defaultColor: '#E8DCC8', defaultMat: 'ceramic' },
        { name: 'Wall Sconce', desc: 'Wall-mounted light', icon: 'fa-lightbulb', fn: 'createWallSconce', defaultColor: '#C0C0C0', defaultMat: 'metal' },
        { name: 'Chandelier', desc: 'Elegant chandelier, ⌀60cm', icon: 'fa-lightbulb', fn: 'createChandelier', defaultColor: '#D4AF37', defaultMat: 'metal' },
        { name: 'LED Strip', desc: 'Ambient LED strip', icon: 'fa-lightbulb', fn: 'createLEDStrip', defaultColor: '#FFFFFF', defaultMat: 'plastic' }
    ],
    // Decor
    decor: [
        { name: 'Bookshelf', desc: 'Tall shelf, 80×180cm', icon: 'fa-book', fn: 'createBookshelf', defaultColor: '#B8956A', defaultMat: 'wood' },
        { name: 'Plant', desc: 'Potted plant, h90cm', icon: 'fa-leaf', fn: 'createPlant', defaultColor: '#C4A882', defaultMat: 'ceramic' },
        { name: 'Rug', desc: 'Area rug, 200×140cm', icon: 'fa-square', fn: 'createRug', defaultColor: '#8A8478', defaultMat: 'fabric' },
        { name: 'TV Stand', desc: 'Media console, 150×50cm', icon: 'fa-tv', fn: 'createTVStand', defaultColor: '#3B3B3B', defaultMat: 'wood' },
        { name: 'Wall Art', desc: 'Framed artwork, 80×60cm', icon: 'fa-image', fn: 'createWallArt', defaultColor: '#5C4033', defaultMat: 'wood' },
        { name: 'Mirror', desc: 'Round wall mirror, ⌀60cm', icon: 'fa-circle', fn: 'createMirror', defaultColor: '#C9A96E', defaultMat: 'metal' },
        { name: 'Vase', desc: 'Decorative vase, h35cm', icon: 'fa-flask', fn: 'createVase', defaultColor: '#C4A882', defaultMat: 'ceramic' },
        { name: 'Curtains', desc: 'Floor-length curtains', icon: 'fa-flag', fn: 'createCurtains', defaultColor: '#E8DCC8', defaultMat: 'fabric' },
        { name: 'Clock', desc: 'Wall clock, ⌀40cm', icon: 'fa-clock', fn: 'createClock', defaultColor: '#333333', defaultMat: 'metal' }
    ],
    // Storage
    storage: [
        { name: 'Wardrobe', desc: 'Double wardrobe, 120×200cm', icon: 'fa-box', fn: 'createWardrobe', defaultColor: '#B8956A', defaultMat: 'wood' },
        { name: 'Dresser', desc: '6-drawer dresser, 100×85cm', icon: 'fa-box', fn: 'createDresser', defaultColor: '#B8956A', defaultMat: 'wood' },
        { name: 'Nightstand', desc: 'Bedside table, 50×45cm', icon: 'fa-border-all', fn: 'createNightstand', defaultColor: '#B8956A', defaultMat: 'wood' },
        { name: 'Chest', desc: 'Storage chest, 90×50cm', icon: 'fa-box', fn: 'createChest', defaultColor: '#D4A76A', defaultMat: 'wood' },
        { name: 'Shoe Rack', desc: 'Shoe storage, 80×40cm', icon: 'fa-shoe-prints', fn: 'createShoeRack', defaultColor: '#8B5A2B', defaultMat: 'wood' }
    ],
    // Beds
    beds: [
        { name: 'Double Bed', desc: 'Queen bed, 160×200cm', icon: 'fa-bed', fn: 'createDoubleBed', defaultColor: '#7A8B6F', defaultMat: 'fabric' },
        { name: 'Single Bed', desc: 'Twin bed, 100×200cm', icon: 'fa-bed', fn: 'createSingleBed', defaultColor: '#7A8B6F', defaultMat: 'fabric' },
        { name: 'Bunk Bed', desc: 'Bunk bed, 100×200cm', icon: 'fa-bed', fn: 'createBunkBed', defaultColor: '#5C4033', defaultMat: 'wood' },
        { name: 'King Bed', desc: 'King size, 180×200cm', icon: 'fa-bed', fn: 'createKingBed', defaultColor: '#6B7D3F', defaultMat: 'fabric' },
        { name: 'Daybed', desc: 'Versatile daybed, 120×200cm', icon: 'fa-bed', fn: 'createDaybed', defaultColor: '#8A8478', defaultMat: 'fabric' }
    ],
    // Dining
    dining: [
        { name: 'Dining Table', desc: 'Rectangular, 180×90cm', icon: 'fa-utensils', fn: 'createDiningTable', defaultColor: '#B8956A', defaultMat: 'wood' },
        { name: 'Round Dining Table', desc: 'Round table, ⌀120cm', icon: 'fa-circle', fn: 'createRoundDiningTable', defaultColor: '#B8956A', defaultMat: 'wood' },
        { name: 'Dining Chair', desc: 'Upholstered chair, 45×50cm', icon: 'fa-chair', fn: 'createDiningChair', defaultColor: '#8A8478', defaultMat: 'fabric' },
        { name: 'Dining Bench', desc: 'Bench for dining, 150×35cm', icon: 'fa-chair', fn: 'createDiningBench', defaultColor: '#B8956A', defaultMat: 'wood' }
    ],
    // Desks
    desks: [
        { name: 'Office Desk', desc: 'Work desk, 140×65cm', icon: 'fa-desktop', fn: 'createOfficeDesk', defaultColor: '#B8956A', defaultMat: 'wood' },
        { name: 'Standing Desk', desc: 'Adjustable desk, 130×60cm', icon: 'fa-desktop', fn: 'createStandingDesk', defaultColor: '#B8956A', defaultMat: 'wood' },
        { name: 'Office Chair', desc: 'Ergonomic chair, 55×55cm', icon: 'fa-chair', fn: 'createOfficeChair', defaultColor: '#3D4F5F', defaultMat: 'fabric' },
        { name: 'Corner Desk', desc: 'L-shaped desk, 150×150cm', icon: 'fa-desktop', fn: 'createCornerDesk', defaultColor: '#8B5A2B', defaultMat: 'wood' }
    ],
    // Electronics
    electronics: [
        { name: 'TV 55"', desc: '55-inch 4K TV', icon: 'fa-tv', fn: 'createTV', defaultColor: '#1A1A1A', defaultMat: 'plastic' },
        { name: 'Floor Speaker', desc: 'Tall speaker, h100cm', icon: 'fa-music', fn: 'createSpeaker', defaultColor: '#2D2D2D', defaultMat: 'wood' },
        { name: 'Laptop', desc: 'Notebook on desk', icon: 'fa-laptop', fn: 'createLaptop', defaultColor: '#C0C0C0', defaultMat: 'metal' },
        { name: 'Soundbar', desc: 'TV soundbar', icon: 'fa-music', fn: 'createSoundbar', defaultColor: '#1A1A1A', defaultMat: 'plastic' }
    ],
    // Kitchen
    kitchen: [
        { name: 'Kitchen Island', desc: 'Prep island, 120×80cm', icon: 'fa-kitchen-set', fn: 'createKitchenIsland', defaultColor: '#B8956A', defaultMat: 'wood' },
        { name: 'Refrigerator', desc: 'Double door fridge', icon: 'fa-fridge', fn: 'createRefrigerator', defaultColor: '#FFFFFF', defaultMat: 'metal' },
        { name: 'Dining Table Small', desc: 'Small kitchen table', icon: 'fa-table', fn: 'createSmallDiningTable', defaultColor: '#B8956A', defaultMat: 'wood' }
    ],
    // Bathroom
    bathroom: [
        { name: 'Bathtub', desc: 'Freestanding tub', icon: 'fa-bath', fn: 'createBathtub', defaultColor: '#FFFFFF', defaultMat: 'ceramic' },
        { name: 'Vanity', desc: 'Bathroom vanity', icon: 'fa-box', fn: 'createVanity', defaultColor: '#B8956A', defaultMat: 'wood' }
    ]
};

// ============================================================
// Material Colors
// ============================================================
export const matColors = {
    fabric: ['#8A8478', '#7A8B6F', '#3D4F5F', '#C17F59', '#E8DCC8', '#C49898', '#4A4A4A', '#6B7D3F', '#B8706A', '#7B8EA0', '#9B8E7E', '#5C6B73', '#D4A373', '#A5A58D'],
    leather: ['#9A6B3C', '#2D2D2D', '#6B4226', '#6B2D3E', '#C4A882', '#F0EDE8', '#8B5A2B', '#4A3728', '#A0522D', '#D2B48C', '#5C3A21', '#3E2723'],
    wood: ['#B8956A', '#5C4033', '#D4A76A', '#8B4513', '#E0C8A0', '#3B3B3B', '#C4A060', '#7B5B3A', '#A0845C', '#6D4C2E', '#DEB887', '#CD853F', '#A0522D'],
    metal: ['#C9A96E', '#C0C0C0', '#333333', '#B5A642', '#B87333', '#A0A0A8', '#D4AF37', '#8C8C8C', '#4A4A4A', '#B8B8C8', '#E8E8E8', '#708090'],
    ceramic: ['#FFFFFF', '#F5F5F5', '#E8E8E8', '#D4D4D4', '#C0C0C0', '#A8A8A8', '#E0DFD5', '#C4B8A8', '#B8C4C0'],
    plastic: ['#1A1A1A', '#2D2D2D', '#4A4A4A', '#6B6B6B', '#8A8A8A', '#C0C0C0', '#E0E0E0']
};

// ============================================================
// Room Presets — Default furniture for each room type
// ============================================================
export const roomPresets = {
    living: [
        { fn: 'createSofa', col: '#7A8B6F', mtype: 'fabric', pos: [0, 0, -2.2], rot: 0 },
        { fn: 'createCoffeeTable', col: '#B8956A', mtype: 'wood', pos: [0, 0, -0.3], rot: 0 },
        { fn: 'createFloorLamp', col: '#333333', mtype: 'metal', pos: [-2.8, 0, -2], rot: 0 },
        { fn: 'createRug', col: '#C49898', mtype: 'fabric', pos: [0, 0, -0.6], rot: 0 },
        { fn: 'createPlant', col: '#C4A882', mtype: 'ceramic', pos: [3, 0, -2.2], rot: 0 },
        { fn: 'createTVStand', col: '#3B3B3B', mtype: 'wood', pos: [0, 0, 2.4], rot: Math.PI },
        { fn: 'createArmchair', col: '#8A8478', mtype: 'fabric', pos: [2.5, 0, -1.5], rot: -0.5 },
        { fn: 'createTV', col: '#1A1A1A', mtype: 'plastic', pos: [0, 0.7, 2.5], rot: Math.PI }
    ],
    bedroom: [
        { fn: 'createDoubleBed', col: '#7A8B6F', mtype: 'fabric', pos: [0, 0, -1.5], rot: 0 },
        { fn: 'createNightstand', col: '#B8956A', mtype: 'wood', pos: [-1, 0, -1.5], rot: 0 },
        { fn: 'createNightstand', col: '#B8956A', mtype: 'wood', pos: [1, 0, -1.5], rot: 0 },
        { fn: 'createWardrobe', col: '#B8956A', mtype: 'wood', pos: [2.2, 0, 1.5], rot: Math.PI },
        { fn: 'createDresser', col: '#B8956A', mtype: 'wood', pos: [-2.2, 0, 0.5], rot: 0 },
        { fn: 'createRug', col: '#C49898', mtype: 'fabric', pos: [0, 0, -0.8], rot: 0 },
        { fn: 'createTableLamp', col: '#E8DCC8', mtype: 'ceramic', pos: [-1, 0.46, -1.5], rot: 0 }
    ],
    dining: [
        { fn: 'createDiningTable', col: '#B8956A', mtype: 'wood', pos: [0, 0, 0], rot: 0 },
        { fn: 'createDiningChair', col: '#8A8478', mtype: 'fabric', pos: [0, 0, 0.7], rot: Math.PI },
        { fn: 'createDiningChair', col: '#8A8478', mtype: 'fabric', pos: [0, 0, -0.7], rot: 0 },
        { fn: 'createDiningChair', col: '#8A8478', mtype: 'fabric', pos: [0.8, 0, 0], rot: -Math.PI / 2 },
        { fn: 'createDiningChair', col: '#8A8478', mtype: 'fabric', pos: [-0.8, 0, 0], rot: Math.PI / 2 },
        { fn: 'createPendant', col: '#C17F4E', mtype: 'metal', pos: [0, 0, 0], rot: 0 },
        { fn: 'createConsole', col: '#B8956A', mtype: 'wood', pos: [0, 0, 2.2], rot: Math.PI },
        { fn: 'createPlant', col: '#C4A882', mtype: 'ceramic', pos: [2.2, 0, 2.2], rot: 0 }
    ],
    office: [
        { fn: 'createOfficeDesk', col: '#B8956A', mtype: 'wood', pos: [0, 0, 0.5], rot: Math.PI },
        { fn: 'createOfficeChair', col: '#3D4F5F', mtype: 'fabric', pos: [0, 0, -0.5], rot: 0 },
        { fn: 'createBookshelf', col: '#B8956A', mtype: 'wood', pos: [2, 0, 0], rot: -Math.PI / 2 },
        { fn: 'createFloorLamp', col: '#333333', mtype: 'metal', pos: [-2, 0, 1.5], rot: 0 },
        { fn: 'createPlant', col: '#C4A882', mtype: 'ceramic', pos: [-2, 0, -1.5], rot: 0 },
        { fn: 'createSideTable', col: '#B8956A', mtype: 'wood', pos: [1.5, 0, -1.8], rot: 0 },
        { fn: 'createLaptop', col: '#C0C0C0', mtype: 'metal', pos: [0, 0.75, 0.5], rot: Math.PI }
    ],
    kids: [
        { fn: 'createBunkBed', col: '#7A8B6F', mtype: 'fabric', pos: [-1, 0, -1.5], rot: 0 },
        { fn: 'createChest', col: '#D4A76A', mtype: 'wood', pos: [1.5, 0, -1], rot: -0.3 },
        { fn: 'createRug', col: '#6B7D3F', mtype: 'fabric', pos: [0.5, 0, 0.5], rot: 0 },
        { fn: 'createBeanBag', col: '#C17F59', mtype: 'fabric', pos: [1.5, 0, 1], rot: 0 },
        { fn: 'createBookshelf', col: '#D4A76A', mtype: 'wood', pos: [-2, 0, 1], rot: Math.PI / 2 },
        { fn: 'createTableLamp', col: '#E8DCC8', mtype: 'ceramic', pos: [-1, 0.25, -0.3], rot: 0 }
    ],
    lobby: [
        { fn: 'createSofa', col: '#8A8478', mtype: 'fabric', pos: [-2.5, 0, -1.5], rot: Math.PI / 2 },
        { fn: 'createSofa', col: '#8A8478', mtype: 'fabric', pos: [2.5, 0, -1.5], rot: -Math.PI / 2 },
        { fn: 'createCoffeeTable', col: '#B8956A', mtype: 'wood', pos: [0, 0, -0.8], rot: 0 },
        { fn: 'createConsole', col: '#B8956A', mtype: 'wood', pos: [0, 0, 2.8], rot: Math.PI },
        { fn: 'createPlant', col: '#C4A882', mtype: 'ceramic', pos: [3.5, 0, 2.5], rot: 0 },
        { fn: 'createWallArt', col: '#5C4033', mtype: 'wood', pos: [0, 0, -2.9], rot: 0 },
        { fn: 'createRug', col: '#8A8478', mtype: 'fabric', pos: [0, 0, -0.5], rot: 0 }
    ],
    kitchen: [
        { fn: 'createKitchenIsland', col: '#B8956A', mtype: 'wood', pos: [0, 0, 0], rot: 0 },
        { fn: 'createRefrigerator', col: '#FFFFFF', mtype: 'metal', pos: [2.2, 0, -1.5], rot: Math.PI },
        { fn: 'createSmallDiningTable', col: '#B8956A', mtype: 'wood', pos: [-1, 0, 1.5], rot: 0 },
        { fn: 'createDiningChair', col: '#8A8478', mtype: 'fabric', pos: [-1, 0, 2.2], rot: 0 }
    ],
    bathroom: [
        { fn: 'createBathtub', col: '#FFFFFF', mtype: 'ceramic', pos: [0, 0, 0], rot: 0 },
        { fn: 'createVanity', col: '#B8956A', mtype: 'wood', pos: [1, 0, 1], rot: 0 }
    ],
    studio: [
        { fn: 'createDoubleBed', col: '#7A8B6F', mtype: 'fabric', pos: [-2, 0, -1], rot: 0 },
        { fn: 'createSofa', col: '#8A8478', mtype: 'fabric', pos: [2, 0, -1], rot: 0 },
        { fn: 'createCoffeeTable', col: '#B8956A', mtype: 'wood', pos: [0, 0, 0], rot: 0 },
        { fn: 'createOfficeDesk', col: '#B8956A', mtype: 'wood', pos: [2, 0, 1.5], rot: -Math.PI / 2 },
        { fn: 'createTVStand', col: '#3B3B3B', mtype: 'wood', pos: [-2, 0, 1.5], rot: Math.PI / 2 }
    ]
};

// ============================================================
// Wall Color Options
// ============================================================
export const wallColorOptions = [
    { name: 'Ivory', color: '#FAF8F4' },
    { name: 'Warm Beige', color: '#E8E2D8' },
    { name: 'Sandstone', color: '#D4C8B8' },
    { name: 'Mist Green', color: '#B8C4C0' },
    { name: 'Taupe', color: '#C4B8A8' },
    { name: 'Pure White', color: '#FFFFFF' },
    { name: 'Cream', color: '#E8DFD5' },
    { name: 'Pale Blue', color: '#D5DEE0' },
    { name: 'Warm Gray', color: '#D0C8C0' },
    { name: 'Sage', color: '#C8D0C0' }
];

// ============================================================
// Builder Function Names Map
// This will be populated from builders.js
// ============================================================
export let builders = {};

// Set builders after import
export function setBuilders(builderObj) {
    Object.assign(builders, builderObj);
}

// ============================================================
// State Management (simple)
// ============================================================
let currentRoomType = 'living';
let currentCategory = 'seating';
let currentMatType = 'fabric';
let currentColor = '#8A8478';

export function getCurrentRoomType() { return currentRoomType; }
export function setCurrentRoomType(type) { currentRoomType = type; }

export function getCurrentCategory() { return currentCategory; }
export function setCurrentCategory(cat) { currentCategory = cat; }

export function getCurrentMatType() { return currentMatType; }
export function setCurrentMatType(type) { currentMatType = type; }

export function getCurrentColor() { return currentColor; }
export function setCurrentColor(color) { currentColor = color; }

export function getWallColorsList() { return wallColorOptions; }

// ============================================================
// Helper to get furniture item by name
// ============================================================
export function getFurnitureItemByName(name) {
    for (const category of Object.values(furnitureItems)) {
        const item = category.find(i => i.name === name);
        if (item) return item;
    }
    return null;
}

// ============================================================
// Helper to get all furniture items flat array
// ============================================================
export function getAllFurnitureItems() {
    return Object.values(furnitureItems).flat();
}

// ============================================================
// Log data loaded
// ============================================================
console.log(`📦 Data loaded: ${Object.values(furnitureItems).flat().length} furniture items, ${roomTypes.length} room types`);