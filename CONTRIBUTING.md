# Contributing to ClipBucket

Thank you for your interest in contributing to ClipBucket! 🎉

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/yourusername/clipbucket.git`
3. **Install dependencies**: `npm install`
4. **Start development**: `npm run dev`
5. **Make your changes**
6. **Test thoroughly**
7. **Create a pull request**

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Local Development
```bash
# Clone the repo
git clone https://github.com/yourusername/clipbucket.git
cd clipbucket

# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Start with DevTools enabled (for debugging)
npm run dev:devtools
```

### Building
```bash
# Build for your current platform
npm run build

# Build for specific platforms
npm run build:mac
npm run build:win
npm run build:linux
```

## 📋 Code Style

We use automated formatting and linting:

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Run linter
npm run lint
```

### Guidelines
- **TypeScript**: Use proper types, avoid `any`
- **Components**: Use functional components with hooks
- **CSS Modules**: Keep styles scoped to components
- **Naming**: Use camelCase for variables, PascalCase for components
- **Comments**: Only when necessary, focus on "why" not "what"

## 🔧 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── feature/         # Feature-specific components  
│   └── screens/         # Main app screens
├── hooks/               # Custom React hooks
└── router/              # React Router setup

electron/
├── config/              # App configuration
├── ipc/                 # IPC handlers
├── storage/             # Data persistence layer
└── ui/                  # Window & tray management
```

## 🐛 Bug Reports

Before reporting bugs:
1. **Search existing issues** first
2. **Try the latest version**
3. **Check if it's already fixed** in main branch

Use our [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) for complete reports.

## ✨ Feature Requests

For new features:
1. **Check the roadmap** in README
2. **Search existing discussions**
3. **Consider the scope** - start small!

Use our [feature request template](.github/ISSUE_TEMPLATE/feature_request.md).

## 🔀 Pull Request Process

1. **Create a feature branch**: `git checkout -b feature/amazing-feature`
2. **Make your changes** with clear commits
3. **Test thoroughly** on your platform
4. **Update documentation** if needed
5. **Run linting**: `npm run lint`
6. **Create PR** with descriptive title and description

### PR Requirements
- [ ] Clear description of changes
- [ ] All tests pass (when we add them)
- [ ] Code follows style guidelines
- [ ] Documentation updated (if applicable)
- [ ] No breaking changes (or clearly marked)

## 🧪 Testing

Currently we rely on manual testing, but automated tests are coming!

**Manual Testing Checklist:**
- [ ] App starts without errors
- [ ] Basic bucket operations (create, rename, delete)
- [ ] Clip operations (add, edit, delete, copy)
- [ ] Search functionality
- [ ] Keyboard shortcuts work
- [ ] Settings save properly

## 🎯 Good First Issues

Look for issues labeled:
- `good first issue` - Perfect for newcomers
- `help wanted` - We'd love contributions
- `documentation` - Non-code contributions welcome

## 📞 Getting Help

- **GitHub Discussions**: For questions and ideas
- **GitHub Issues**: For bugs and feature requests
- **Code Review**: Ask questions in PR comments

---

**Ready to contribute?** Check out the [open issues](https://github.com/yourusername/clipbucket/issues) and jump in!

Thanks for making ClipBucket better! 🚀