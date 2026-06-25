# QuizMaster Pro 🎓

A modern, gamified, **100% client-side** quiz learning platform. No build step,
no server — runs from a single `index.html`. Perfect for **VS Code Live Server**
and **GitHub Pages**.

## ✨ Features
- Categories: School, Intermediate, Polytechnic, B.Tech, Competitive, GK
- Timer, scoring, XP, ranks, badges
- Leaderboard, analytics, profile
- Printable certificate (Download as PDF via browser print dialog)
- Fully responsive (mobile-first)
- **Client-side "backend"** using `localStorage` (progress persists across sessions)

## 📁 Folder structure
```
quizmaster-pro/
├── index.html       ← entry point (root of GitHub Pages)
├── quizmaster.js    ← Alpine.js app + LS persistence
├── README.md
└── .gitignore
```
All asset paths are **relative** (`./quizmaster.js`) so GitHub Pages works
immediately from any subpath.

## ▶️ Run locally (VS Code Live Server)
1. Install the **Live Server** extension by Ritwick Dey.
2. Open this folder in VS Code.
3. Right-click `index.html` → **Open with Live Server**.
4. Done — opens at `http://127.0.0.1:5500`.

## 🚀 Deploy to GitHub Pages
1. Create a new repo, e.g. `quizmaster-pro`.
2. Commit files at the **repo root** (do NOT nest in a subfolder).
3. Repo → **Settings → Pages** → Source: `main` / `root`.
4. Visit `https://<you>.github.io/quizmaster-pro/`.

## 💾 How the client-side backend works
- `LS.get(key, fallback)` / `LS.set(key, value)` — safe JSON wrappers.
- Keys used: `qmp_user`, `qmp_history`.
- State saves on every quiz finish, profile edit, and `beforeunload`.
- Reset anytime from the **Profile** tab.

## ➕ Add your own questions
Edit the `QUIZZES` object in `quizmaster.js`:
```js
mysubject: {
  name: "My Subject",
  questions: [{ q: "Question?", options: ["A","B","C","D"], answer: 2 }]
}
```

## 🧰 Tech
Tailwind CSS (CDN) · Alpine.js (CDN) · LocalStorage. No build, no server.

## 📜 License
MIT
