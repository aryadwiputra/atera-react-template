# Atera - React Admin Dashboard Template

Atera is a modern admin dashboard template built with React 19, TypeScript, and Vite. It provides a complete foundation for building admin applications with a focus on ease of use, customization, and developer experience.

## What Makes Atera Special

- **Full-Featured Dashboard** - Pre-built analytics, orders, customers, finance, inventory, HR, and more
- **Service Layer Architecture** - Easy backend integration with typed interfaces
- **Comprehensive Theming System** - 5 color presets, dark/light modes, customizable density and layout
- **Internationalization** - Built-in support for English, German, and French
- **Developer-Friendly** - Comprehensive documentation and clear patterns
- **Production Ready** - TypeScript, testing, linting, and build pipeline included

## Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Run lint checks
bun run lint
```

## Key Features

### 📊 Ready-Made Pages
- **Dashboard** - Analytics overview with metrics cards and charts
- **Orders & Products** - CRUD management with data tables
- **Customers & Users** - Customer relationship management
- **Finance & Accounting** - Transaction tracking and reporting
- **Inventory & Assets** - Asset management and tracking
- **HR & Employees** - Human resources management
- **Mail & Communication** - Email system
- **Projects & Workspaces** - Project management

### 🎨 Customization
- **5 Color Presets** - Zinc, Blue, Violet, Rose, Orange
- **Light/Dark Themes** - System-based theme switching
- **Density Options** - Compact, comfortable, spacious
- **Layout Options** - Sidebar vs top navigation
- **Container Options** - Fixed width, full width

### 🔧 Developer Experience
- **TypeScript First** - Full type safety with strict mode
- **Service Layer** - Easy backend integration
- **Component System** - 49 UI components built with Radix primitives
- **Comprehensive i18n** - English, German, French support
- **Documentation** - In-app documentation and comprehensive guides

## Project Structure

```
/src
├── pages/              # Route components
├── layouts/            # Page layouts
├── components/        # UI components
│   ├── ui/            # shadcn/ui components
│   └── shared/        # Shared components
├── hooks/              # Custom hooks
├── lib/                # Utilities and services
│   ├── data/          # Data modules
│   └── services/      # Service layer (easy backend integration)
├── i18n/               # Internationalization
├── app.css             # TailwindCSS theme and tokens
└── main.tsx           # App entry point
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start development**
   ```bash
   bun run dev
   ```

4. **Access the app**
   - Local: `http://localhost:5173`
   - Demo login: `demo@example.com` / `AteraDemo2026!`

## Documentation

For comprehensive documentation, visit the **Documentation** page:
- **Architecture Overview** - Project structure and data flow
- **Service Layer** - Backend integration guide
- **Theming & Customization** - Styling and theming
- **Components** - UI component documentation
- **i18n** - Internationalization guide
- **Adding Pages** - How to add new pages to the template

The documentation is accessible via the navigation menu or directly at `/docs`.

## Development

### Linting
```bash
bun run lint
```

### Building
```bash
bun run build
```

### Type Checking
```bash
tsc -b
```

### Testing
```bash
# Tests are not configured in this template
```

## Customization

### Theme Colors
Customize the theme colors by modifying the color presets in `src/app.css`:

```css
/* Available color presets */
[data-color="zinc"] {
  --primary: oklch(0.446 0.037 259.580);
}

[data-color="blue"] {
  --primary: oklch(0.546 0.221 260.297);
}
```

### Layout Options
Switch between sidebar and top navigation:
```tsx
// In your app, add:
data-container="boxed" // for boxed layout
data-density="compact" // for compact density
```

### Adding a New Page

1. Create a new component file in `src/pages/`
2. Import it in `src/App.tsx` and add the route
3. Update `src/lib/navigation.ts` with navigation configuration
4. Add i18n keys for all languages
5. Run `bun run lint && bun run build`

## Support & Contributions

This template is actively maintained. For questions, issues, or contributions, please reach out through the appropriate channels.

---

*Built with React, TypeScript, and Vite — Designed for modern admin applications*
