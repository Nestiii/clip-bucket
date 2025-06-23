# 📋 ClipBucket

A modern, privacy-first clipboard manager for developers and power users. Organize your clipboard history into smart buckets for quick access to code snippets, commands, and frequently used text.

## ✨ Features

- 🗂️ **Smart Buckets** - Organize clipboard items into categorized collections
- ⚡ **Instant Access** - Quick copy/paste from your menubar/system tray
- 🔒 **Privacy First** - All data stored locally, no cloud required
- 🎨 **Developer Friendly** - Perfect for code snippets, terminal commands, and text templates
- 🌙 **Dark Theme** - Easy on the eyes with a modern yellow accent
- 📱 **Cross Platform** - Works on macOS, Windows, and Linux
- ⌨️ **Keyboard Shortcuts** - Quick access without leaving your workflow

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/clipbucket.git
   cd clipbucket
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Backend**: Electron (Node.js)
- **Routing**: React Router 6
- **Styling**: CSS Modules + CSS Variables
- **Build Tool**: Vite
- **Icons**: Phosphor Icons (planned)
- **Error Handling**: react-error-boundary

## 📁 Project Structure

```
src/
├── main/                    # Electron main process
│   ├── config/              # App configuration
│   ├── storage/             # Data persistence
│   ├── ui/                  # Window & tray management
│   ├── ipc/                 # IPC communication
│   └── index.ts             # Main entry point
├── renderer/                # React app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── error/       # Error handling
│   │   │   └── layout/      # Layout components
│   │   ├── pages/           # Page components
│   │   ├── router/          # Routing configuration
│   │   ├── styles/          # Global styles & variables
│   │   └── App.tsx          # App entry point
└── preload/                 # Preload scripts
```

## 🎨 Design System

The app uses a custom design system with:

- **Colors**: Dark theme with yellow accents (`#fee402`, `#fdca00`)
- **Typography**: System fonts with consistent sizing
- **Spacing**: 8px grid system
- **Components**: Modular, reusable components with CSS Modules

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Code Style

- **TypeScript** for type safety
- **CSS Modules** for scoped styling
- **Arrow functions** for consistency
- **Prettier** for code formatting
- **ESLint** for code quality

## 🗂️ How It Works

1. **Create Buckets** - Organize your clipboard items by category
2. **Save Items** - Manually save clipboard content to specific buckets
3. **Quick Access** - Click any item to copy it back to your clipboard
4. **Stay Organized** - Keep your most-used snippets organized and accessible

## 🔐 Privacy & Security

- **Local Storage** - All data stays on your device
- **No Tracking** - No analytics or data collection
- **No Network** - Works completely offline
- **Encrypted Storage** - (Planned) Optional encryption for sensitive data

## 🗺️ Roadmap

- [ ] **Authentication** - Optional cloud sync
- [ ] **Export/Import** - Backup and restore buckets
- [ ] **Keyboard Shortcuts** - Global hotkeys
- [ ] **Search** - Find items across all buckets
- [ ] **Rich Content** - Support for images and files
- [ ] **Themes** - Light mode and custom themes
- [ ] **Cloud Sync** - Optional backup to user's cloud storage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Electron Vite](https://electron-vite.org/)
- Icons by [Phosphor Icons](https://phosphoricons.com/)
- Error handling by [react-error-boundary](https://github.com/bvaughn/react-error-boundary)

---

<div align="center">
  <strong>Keep your clipboard organized. Stay productive.</strong>
  <br>
  Made with ❤️ for developers and power users
</div>
