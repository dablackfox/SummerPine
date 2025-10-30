# SummerPine — Documentation

This document gives a concise overview of the SummerPine Electron application, how to run it in development, how to build distributables, the repository layout, and a short note on stopping Git from tracking `dist/`.

## Overview

SummerPine is an Electron-based wrapper application that loads local HTML/CSS/JS assets (see `html/` and `styles/`) and packages them into desktop apps using `electron-builder`.

Key files:
- `main.js` — Electron main process entry.
- `preload.js` — Preload script for renderer processes.
- `html/` — HTML pages and snippets used by the app.
- `styles/` — CSS stylesheets used by the UI.
- `build/` — Build assets and configuration (icons, config files).

## Prerequisites

- Node.js (LTS recommended)
- npm (comes with Node.js)
- For building installers: platform toolchains required by `electron-builder` (see `electron-builder` docs)

## Install (development)

From the repository root:

```bash
npm install
```

## Run (development)

Start the app with:

```bash
npm start
```

This runs the `electron .` script defined in `package.json`.

## Build (produce distributables)

The `package.json` already contains build scripts using `electron-builder`:

- `npm run build:linux-win` — build installers for Windows and Linux
- `npm run build:mac` — build macOS DMG

These rely on the configuration in `package.json` under the `build` key and on files in the `build/` directory (icons, config files). See `electron-builder` docs for platform-specific requirements.

## Repository layout (important files)

- `main.js` — Electron main entry
- `preload.js` — Preload script
- `package.json` — Project metadata, scripts, and build config
- `electron-builder.yml` — Additional electron-builder config (if used)
- `build/` — Icons and build configuration files
- `html/` — Application HTML pages
- `styles/` — CSS files
- `README.md` — Project readme (short)

## Configuration

Look in `build/config/config.json` and `build/multi_store_config.json` for app-specific configuration used by the app. If you need to override settings, check `build/overrides.js` which is present in the repository.

## Stopping Git from tracking dist/

If you currently have a `dist/` directory tracked in Git and want to stop tracking it while keeping the local files, run the following from the repository root:

```bash
# 1) Add dist/ to .gitignore (create `.gitignore` if it doesn't exist)
echo "dist/" >> .gitignore

# 2) Remove the directory from the index without deleting local files
git rm -r --cached dist

# 3) Commit the change
git add .gitignore
git commit -m "Stop tracking dist/"

# 4) Verify dist/ is now ignored
git status --porcelain
git ls-files --others --exclude-standard | grep dist || true
```

If you want, I can add `dist/` to `.gitignore` and run the `git rm -r --cached dist` + commit for you — tell me whether you want me to push the commit to the remote.

## Contributing

1. Fork the repo or work on a feature branch.
2. Add tests or manual verification steps for UI changes.
3. Open a PR with a clear summary and the platform(s) you tested on.

## License

See `LICENSE.md` at the repository root.

---
