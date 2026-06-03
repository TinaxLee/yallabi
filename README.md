# 🌍 Yallabi — Global Travel Planner PWA

> Plan smarter. Travel lighter. Split easier.

Yallabi is a **mobile-first Progressive Web App** for group and solo travel planning. Built as a single-file Vanilla JS app with Firebase backend — no build system, no dependencies, just pure web.

---

## ✨ Features

- **🗺️ Trip Itinerary** — Day-by-day schedule with timeline view, type tagging (food / hotel / attraction / transport), transport connector annotations, and Google Maps navigation
- **💰 Expense Tracker** — Multi-currency recording (150+ currencies), real-time exchange rate API, per-person payer selection, split modes (equal / personal / treat), and automatic minimum-transfer settlement calculation
- **🌏 Country Themes** — 20+ destination themes with Morandi-palette color systems (Thailand, Japan, France, Korea, Italy, Greece, and more)
- **🌙 Auto Dark Mode** — Time-based switching (18:00–07:00 dark), with manual override
- **🤖 Bibi AI Assistant** — In-app travel strategy assistant powered by AI, with language auto-detection per destination
- **📋 Packing & Missions** — Checklist management for packing lists and trip tasks
- **✈️ Flight & Hotel Tracker** — Record and view booking details
- **📖 Travel Journal** — Per-trip diary entries
- **👥 Group Members** — Multi-member support with shared Firestore data
- **📱 PWA** — Installable on iOS and Android, offline-capable via Service Worker

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla JS (ES Modules), HTML5, CSS3 |
| Backend | Firebase Firestore, Firebase Auth, Firebase Storage |
| Charts | Chart.js |
| Auth | Google OAuth, Apple OAuth |
| Exchange Rates | open.er-api.com (primary), exchangerate-api.com (fallback) |
| PWA | Web App Manifest + Service Worker |

---

## 🚀 Getting Started

1. Clone this repo
2. Set up a Firebase project and replace `firebaseConfig` in `index.html`
3. Enable Firestore, Authentication (Google + Apple), and Storage in Firebase Console
4. Open `index.html` in a browser — no build step needed

```bash
git clone https://github.com/TinaxLee/yallabi.git
cd yallabi
# open index.html directly or serve with any static server
npx serve .
```

---

## 📁 Project Structure

```
yallabi/
├── index.html      # Entire app (5400+ lines, single-file architecture)
├── style.css       # Global styles + country theme variables
├── manifest.json   # PWA manifest
├── sw.js           # Service Worker for offline support
└── icon.png        # App icon
```

---

## 🌐 Supported Destinations

Thailand · Japan · France · Italy · Greece · Morocco · Maldives · Korea · Singapore · USA · Australia · UK · Vietnam · Indonesia · Spain · Turkey · Egypt · New Zealand · Canada · Portugal · and more via AI theme fallback

---

## 🤝 Contributing

Issues and PRs are welcome! This project is actively maintained and evolving.

- Feature requests: open an Issue
- Bug reports: include browser + device info

---

## 📄 License

MIT
