<div align="center">

  <h1>📋 ClipBucket</h1>

  **A privacy-first clipboard manager that organizes your clips into smart buckets**
  
  Perfect for developers, writers, and anyone who copies a lot of text
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg)](https://github.com/yourusername/clipbucket/releases)
  
</div>

## ✨ Features

- 🗂️ **Smart Buckets** - Organize your clipboard items into categorized collections
- ⚡ **Quick Capture** - `Cmd+Shift+C` to instantly copy and save selected text
- 🎯 **Fast Toggle** - `Cmd+Shift+L` to show/hide ClipBucket instantly
- 🔒 **Privacy First** - All data stored locally, no cloud, no tracking
- 🌙 **Beautiful Dark UI** - Modern interface that's easy on the eyes
- 📱 **Cross Platform** - Works on macOS, Windows, and Linux
- ⌨️ **Keyboard Friendly** - Fully navigable with shortcuts

## 🚀 Download & Install

> **⚠️ Platform Support Notice**  
> ClipBucket is primarily developed and tested on **macOS**. While Windows and Linux builds are available, they receive limited testing and support. macOS users will have the most stable experience.

### For Users (Recommended)

**[⬇️ Download Latest Release](https://github.com/Nestiii/clip-bucket/releases/latest)**

Choose your platform:
- **macOS**: Download `ClipBucket-mac.dmg` ✅ **Fully Supported**
- **Windows**: Download `ClipBucket-win.exe` ⚠️ **Limited Testing**
- **Linux**: Download `ClipBucket-linux.AppImage` ⚠️ **Limited Testing**

### macOS Installation

1. Download `ClipBucket-mac.dmg`
2. Open the DMG and drag ClipBucket to Applications
3. **Important**: Remove quarantine (macOS security requirement)

**Option A - Use our script:**
```bash
# Download and run the removal script
curl -O https://raw.githubusercontent.com/yourusername/clipbucket/main/remove-quarantine.sh
chmod +x remove-quarantine.sh
./remove-quarantine.sh
```

**Option B - Manual removal:**
```bash
# Remove quarantine manually
xattr -d com.apple.quarantine /Applications/ClipBucket.app
```

**Option C - Right-click method:**
- Right-click ClipBucket.app → "Open" → "Open" in the dialog

### Windows Installation

1. Download `ClipBucket-win.exe`
2. Run the installer
3. Launch ClipBucket from Start Menu or Desktop

### Linux Installation

1. Download `ClipBucket-linux.AppImage`
2. Make it executable: `chmod +x ClipBucket-linux.AppImage`
3. Run: `./ClipBucket-linux.AppImage`

## 🎯 How to Use

### 1. **Quick Start**
- Launch ClipBucket
- Press `Cmd+Shift+L` (or `Ctrl+Shift+L` on Windows/Linux) to toggle the window
- Create your first bucket by clicking the "+" button

### 2. **Quick Capture**
- Select any text in any app
- Press `Cmd+Shift+C` (or `Ctrl+Shift+C`)
- Text is automatically copied to clipboard AND saved to your bucket!

### 3. **Organize with Buckets**
- **Code Snippets** - Store your frequently used code
- **Commands** - Terminal commands and scripts  
- **Templates** - Email templates, responses, etc.
- **Personal** - Notes, addresses, phone numbers

### 4. **Search & Access**
- Use the search box to find any clip instantly
- Click any clip to copy it to your clipboard
- Edit clip names and content directly

## 🛠️ For Developers

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/clipbucket.git
cd clipbucket

# Install dependencies
npm install

# Start development server
npm run dev

# Start with DevTools enabled
npm run dev:devtools
```

### Build Commands

```bash
# Full production build
npm run build

# Compile only (no packaging)
npm run compile

# Platform-specific builds
npm run build:mac
npm run build:win  
npm run build:linux

# Build for all platforms
npm run build:all
```

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript + CSS Modules
- **Backend**: Electron + Node.js
- **Build**: Vite + electron-builder
- **Storage**: Local JSON files (encrypted storage planned)
- **Icons**: Phosphor Icons
- **Routing**: React Router with hash routing

## 📁 Project Structure

```
clipbucket/
├── electron/                   # Electron main process
│   ├── config/                 # App configuration
│   ├── ipc/                    # IPC handlers
│   ├── storage/                # Local data persistence
│   ├── ui/                     # Window & tray management
│   └── main.ts                 # Main entry point
├── src/                        # React frontend
│   ├── components/             # Reusable UI components
│   │   ├── auth/              # Authentication components
│   │   ├── common/            # Generic UI components
│   │   ├── feature/           # Feature-specific components
│   │   └── screens/           # Main app screens
│   ├── hooks/                 # Custom React hooks
│   └── router/                # React Router setup
├── shared/                     # Shared types & utilities
└── public/                     # Static assets
```

## ⚡ Keyboard Shortcuts

| Shortcut | Action |
|----------|---------|
| `Cmd+Shift+L` | Toggle ClipBucket window |
| `Cmd+Shift+C` | Quick capture (copy + save) |
| `Escape` | Close window |

*Windows/Linux: Replace `Cmd` with `Ctrl`*

## 🔐 Privacy & Security

- ✅ **100% Local** - All data stays on your device
- ✅ **No Tracking** - Zero analytics or telemetry
- ✅ **No Network** - Works completely offline
- ✅ **Open Source** - Full transparency, audit the code
- 🔄 **Planned**: Optional encryption for sensitive clips

## 🐛 Troubleshooting

### macOS: "ClipBucket can't be opened"
This is macOS Gatekeeper protection. Use one of the removal methods above.

### Windows: "Windows protected your PC"
Click "More info" → "Run anyway". This happens because the app isn't code-signed yet.

### Linux: Permission denied
Make the AppImage executable: `chmod +x ClipBucket-linux.AppImage`

### Global shortcuts not working
- Make sure ClipBucket has accessibility permissions
- Check if shortcuts conflict with other apps
- Try customizing shortcuts in Settings

## 🗺️ Roadmap

- [ ] **Cloud Sync** - Optional backup to your preferred cloud service
- [ ] **Rich Content** - Support for images and files
- [ ] **Themes** - Light mode and custom color schemes
- [ ] **Import/Export** - Backup and restore your buckets
- [ ] **Encryption** - Optional encryption for sensitive clips
- [ ] **Team Sharing** - Share buckets with your team
- [ ] **Plugin System** - Extend functionality with plugins

## 🤝 Contributing

We welcome contributions! Here's how to help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with a clear message: `git commit -m 'Add amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation
- Make sure all builds pass

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Electron](https://electronjs.org/) and [Vite](https://vitejs.dev/)
- Icons by [Phosphor Icons](https://phosphoricons.com/)
- UI inspired by modern macOS apps

## 💬 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Nestiii/clipbucket/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/Nestiii/clipbucket/discussions)
- 📧 **Contact**: facundo.rivas.if@gmail.com

---

<div align="center">
  <strong>Keep your clipboard organized. Stay productive.</strong>
  <br><br>
  Made with ❤️ for developers, writers, and productivity enthusiasts
  <br><br>
  <a href="https://github.com/yourusername/clipbucket/releases/latest">
    <img src="https://img.shields.io/badge/Download-Latest%20Release-fee402?style=for-the-badge&logo=download" alt="Download Latest Release">
  </a>
</div>
