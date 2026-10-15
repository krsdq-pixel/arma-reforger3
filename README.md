# Arma Reforger — Vanilla Fire Control System (FCS) & Tactical Map

[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?logo=github)](https://krsdq-pixel.github.io/arma-reforger-2/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?logo=leaflet)](https://leafletjs.com/)

A high-precision fire control calculator and interactive tactical map built specifically for **Arma Reforger** vanilla mortar artillery and direct fire weapons.

Designed for mortar squads, forward observers, and fire direction centers (FDC) seeking instant, reliable firing solutions in both **NATO (6400)** and **Soviet / Warsaw Pact (60-00)** mil systems.

---

## 🗺️ Supported Vanilla Terrains

| Terrain | Map Dimensions | Available Layers | Native Zoom Levels |
| :--- | :--- | :--- | :--- |
| **Everon** | 12.8 km × 12.8 km (12,800m) | Topographic (`topo`), Satellite (`sat`), Tactical Drawn (`drawn`) | Zoom 0 to 7 (scaled to 9) |
| **Arland** | 4.1 km × 4.1 km (4,096m) | Topographic (`topo`), Satellite (`sat`), Tactical Drawn (`drawn`) | Zoom 0 to 7 (scaled to 9) |
| **Kolguyev** | 12.8 km × 12.8 km (12,800m) | Topographic (`topo`), Satellite (`sat`) | Zoom 0 to 7 (scaled to 9) |

- **True 1:1 In-Game Coordinates**: Powered by a custom Leaflet CRS matching Arma Reforger's meter grid coordinate system.
- **Arma Grid Reference**: Displays coordinates in standard 6-digit (100m) and 8-digit (10m) grid formats (`XXX ZZZ` / `XXXX ZZZZ`).
- **Tactical Points of Interest (POIs)**: 1-click targeting for major capitals, towns, villages, military compounds, and hills.
- **Interactive Measurement Ruler**: Multi-point distance, heading (degrees), and azimuth (mils) tool.

---

## 🎯 Ballistic Engine & Weapon Systems

### 1. 🇺🇸 American Mortar — M252 81mm (M821 HE)
- **Sight Scale**: M67 Sight Unit — **6400 NATO Mils** (1 mil ≈ 0.05625°, 17.78 mils/deg).
- **Elevation Range**: 800 mils (45.0°) to 1511 mils (85.0°).
- **Propellant Charge Rings (0 to 4)**:
  - **Ring 0**: 75m – 480m (Muzzle Velocity: 68 m/s, TOF: 7.9s – 12.8s)
  - **Ring 1**: 200m – 1,080m (Muzzle Velocity: 105 m/s, TOF: 11.1s – 20.2s)
  - **Ring 2**: 400m – 2,050m (Muzzle Velocity: 145 m/s, TOF: 14.9s – 27.8s)
  - **Ring 3**: 650m – 3,200m (Muzzle Velocity: 182 m/s, TOF: 18.6s – 34.8s)
  - **Ring 4**: 950m – 4,500m (Muzzle Velocity: 220 m/s, TOF: 21.6s – 42.0s)

### 2. 🇷🇺 Soviet Mortar — 2B14 Podnos 82mm (O-832DU HE)
- **Sight Scale**: MPM-44M Sight — **60-00 Warsaw Pact Mils** (6000 mils per circle; formatted as `XX-YY`, where 100 mils = 6.0°).
- **Elevation Range**: 750 mils (45.0° / `07-50`) to 1417 mils (85.0° / `14-17`).
- **Propellant Charge Rings (0 to 4)**:
  - **Ring 0**: 80m – 470m (Muzzle Velocity: 70 m/s, TOF: 6.8s – 12.2s)
  - **Ring 1**: 220m – 1,150m (Muzzle Velocity: 110 m/s, TOF: 10.2s – 19.4s)
  - **Ring 2**: 420m – 2,100m (Muzzle Velocity: 150 m/s, TOF: 14.0s – 26.8s)
  - **Ring 3**: 650m – 3,100m (Muzzle Velocity: 185 m/s, TOF: 18.2s – 33.8s)
  - **Ring 4**: 950m – 4,250m (Muzzle Velocity: 215 m/s, TOF: 20.5s – 40.5s)

### 3. 🛡️ SPG-9 Kopye 73mm Recoilless Rifle
- High-velocity direct fire (435 m/s) with elevation solutions from 100m to 1,300m.

---

## ⚡ Core Features

- **Automatic Ring Optimization**: Automatically picks the safest, most stable charge ring based on target range while supporting immediate manual overrides.
- **Altitude / Slope Correction ($\Delta H$)**: Accurately corrects high-angle tube elevation for terrain elevation differences between gun and target.
- **Physical Limit Protection**: Alerts the crew if elevation angles exceed maximum tube limits (45° – 85°).
- **Squad Radio Callout Copier**: Generates standardized military callouts with 1-click clipboard copy:
  ```
  [FIRE MISSION - EVERON] M252 81mm Mortar (81mm M821 HE) | RING: 2 | AZ: 1245 mils (70.0°) | EL: 1339 mils (75.3°) | RNG: 1000m (ΔH: +7m) | TOF: 25.9s | GUN: 048 071 | TGT: 057 070
  ```
- **Mobile-Ready Responsive HUD**: Seamless switching between the tactical map and the fire control calculator on handheld devices.

---

## 🚀 GitHub Pages Deployment Guide

This project is configured with a automated GitHub Actions deployment workflow (`.github/workflows/deploy.yml`).

### Required GitHub Repository Setup:
1. Navigate to your repository on GitHub: `https://github.com/krsdq-pixel/arma-reforger-2`.
2. Go to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions** (do **not** select "Deploy from a branch").
4. Every `push` to `main` will automatically build the Vite application and publish to GitHub Pages.

> **Note on Jekyll:** The repository deliberately avoids `jekyll-gh-pages.yml` because Jekyll is only intended for Ruby static generators. This project uses React + Vite and deploys the compiled `./dist` directory.

---

## 💻 Local Development

### Prerequisites
- Node.js 20+ or 22+
- npm 10+

### Setup & Run
```bash
# Clone the repository
git clone https://github.com/krsdq-pixel/arma-reforger-2.git
cd arma-reforger-2

# Install dependencies (zero conflicts)
npm install

# Start local development server
npm run dev

# Run TypeScript type check
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License & Attribution
- Game data, coordinate mappings, and world assets &copy; **Bohemia Interactive a.s.**
- Tactical map tile services powered by **Enfumap / Bohemia Interactive**.
- Code released for the Arma Reforger community.
