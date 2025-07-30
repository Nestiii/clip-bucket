# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ClipBucket is a privacy-first clipboard manager built with Electron and React. It allows users to organize clipboard items into categorized "buckets" for quick access to code snippets, commands, and frequently used text. All data is stored locally with no cloud sync required.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server with hot reload
- `npm run dev:devtools` - Start development with DevTools enabled
- `npm run build` - Full production build (TypeScript + Vite + Electron)
- `npm run compile` - Compile only (TypeScript + Vite, no electron-builder)
- `npm run lint` - Run ESLint for code quality checks
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting without changes

### Platform-Specific Builds
- `npm run build:mac` - Build for macOS (DMG + ZIP)
- `npm run build:win` - Build for Windows (NSIS + Portable)
- `npm run build:linux` - Build for Linux (AppImage + DEB + RPM)
- `npm run build:all` - Build for all platforms

### Distribution
- `npm run dist` - Package pre-compiled app with electron-builder
- `npm run dist:mac/win/linux` - Platform-specific packaging

## Architecture

### Core Structure
- **Frontend**: React 18 + TypeScript with CSS Modules
- **Backend**: Electron main process with IPC communication
- **Routing**: React Router with hash-based routing
- **Build**: Vite with vite-plugin-electron
- **Styling**: CSS Modules with camelCase locals convention

### Directory Structure
```
electron/                    # Electron main process
├── config/                  # App configuration management
├── ipc/                     # IPC handlers for frontend communication
├── storage/                 # Local data persistence
├── ui/                      # Window and tray management
├── main.ts                  # Main entry point
└── preload.ts              # Preload script for secure IPC

src/                        # React frontend
├── components/             # Reusable UI components
│   ├── auth/              # Authentication-related components
│   ├── common/            # Generic UI components (Button, Input, etc.)
│   ├── error/             # Error boundaries and fallbacks
│   ├── feature/           # Feature-specific components
│   └── screens/           # Main application screens
├── hooks/                 # Custom React hooks
│   ├── api/               # Data fetching hooks
│   └── utils/             # Utility hooks
├── router/                # React Router configuration
└── mock/                  # Mock data for development

shared/                    # Shared types and utilities
├── types.ts              # TypeScript interfaces
└── ipcEvents.ts          # IPC event definitions
```

### Key Components

#### Data Layer
- **Storage System**: Local file-based storage in `electron/storage/storage.ts`
- **IPC Communication**: Bidirectional communication between main and renderer processes
- **Data Models**: `Bucket`, `Clip`, `AppConfig` interfaces in `shared/types.ts`

#### UI Layer
- **Screen Components**: Home, Bucket, Settings, Welcome screens
- **Feature Components**: BucketItem, ClipItem, ClipPreview for core functionality
- **Common Components**: Reusable UI elements with consistent styling

#### Main Process
- **Window Management**: Single-window app with tray functionality
- **Global Shortcuts**: System-wide keyboard shortcuts for quick access
- **Clipboard Monitoring**: Real-time clipboard content capture

### IPC Architecture
The app uses a comprehensive IPC system with handlers in `electron/ipc/`:
- `bucketHandlers.ts` - Bucket CRUD operations
- `clipHandlers.ts` - Clip management
- `clipboardHandlers.ts` - System clipboard operations
- `configHandlers.ts` - App configuration
- `searchHandlers.ts` - Search functionality
- `settingsHandlers.ts` - User preferences

### CSS Architecture
- **CSS Modules**: Component-scoped styling with camelCase conversion
- **CSS Variables**: Dark theme with yellow accent colors (`#fee402`, `#fdca00`)
- **8px Grid System**: Consistent spacing throughout the app
- **System Fonts**: Native OS typography

## Development Notes

### TypeScript Configuration
- Strict mode enabled with comprehensive linting rules
- ES2020 target with modern syntax support
- Bundler module resolution for Vite compatibility

### Error Handling
- React Error Boundaries for UI error recovery
- Global process error handlers in main process
- Comprehensive error types and validation

### Storage
- Local JSON-based storage system
- Hidden files for data persistence (dotfiles)
- Automatic backup and recovery mechanisms

### Styling Conventions
- CSS Modules with local scope
- Component-specific stylesheets
- Consistent naming: `ComponentName.module.css`
- Dark theme by default with system integration