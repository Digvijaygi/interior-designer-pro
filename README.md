# 🏠 Interior Studio Pro

**Professional 3D Interior Design Application** - A browser-based interior design tool that lets you create, customize, and visualize room layouts with realistic 3D furniture.

[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge)](https://interior-studio-pro.vercel.app)
[![Three.js](https://img.shields.io/badge/Three.js-r160-blue?style=for-the-badge)](https://threejs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## ✨ Features

### 🎨 Design Tools
- **Drag & Drop Furniture** - Easy placement of 60+ furniture items
- **9 Room Types** - Living, Bedroom, Dining, Office, Kids, Lobby, Kitchen, Bathroom, Studio
- **Real-time 3D Preview** - Instant visual feedback with realistic lighting
- **Material Customization** - Change colors and materials (fabric, leather, wood, metal, ceramic)

### 🛠️ Advanced Features
- **Undo/Redo System** - Ctrl+Z / Ctrl+Y with 50-step history
- **Save/Load Projects** - Export to JSON file, import back anytime
- **Auto-save** - Automatic localStorage backup
- **Lighting Presets** - Day, Evening, Night modes
- **Screenshot Capture** - PNG export with metadata
- **Measure Tool** - Click two points to measure distances
- **Dark Mode** - Toggle between light and dark themes

### 🖱️ Controls
| Action | Control |
|--------|---------|
| Rotate Camera | Left click + drag |
| Pan Camera | Right click + drag |
| Select Item | Click on furniture |
| Move Item | Click + drag selected item |
| Delete Item | Delete / Backspace key |
| Duplicate Item | Ctrl + D |
| Undo | Ctrl + Z |
| Redo | Ctrl + Y |
| Deselect | Escape key |

---
interior-designer/
│
├── index.html                 # Main entry page (landing + editor)
├── about.html                 # About/Help page (optional)
├── style.css                  # Global styles + dark mode
│
├── js/
│   ├── main.js                # App entry point, init Three.js, UI events
│   ├── data.js                # Rooms, furniture categories, items, presets
│   ├── builders.js            # All 3D model builder functions (sofa, table, bed, etc.)
│   ├── scene.js               # Scene, camera, renderer, lighting setup
│   ├── controls.js            # Raycaster, drag-drop, object selection, measurement tool
│   ├── undo-redo.js           # History stack (undo/redo logic)
│   ├── storage.js             # Save/load project to JSON, localStorage, export file
│   └── utils.js               # Helpers (random ID, colors, format area, etc.)
│
├── assets/
│   ├── textures/              # Wood, fabric, metal textures (optional)
│   └── models/                # Any external .gltf files (optional)
│
├── vercel.json                # Vercel static deployment config
├── package.json               # (optional) for dev server or scripts
└── README.md                  # Project docs, how to run locally & deploy




## 🚀 Quick Start

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/interior-studio-pro.git
cd interior-studio-pro
