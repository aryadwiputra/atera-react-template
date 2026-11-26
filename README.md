# Atera - React Admin Dashboard Template

Atera is a modern admin dashboard template built with React 19, TypeScript, and Vite. It provides a complete foundation for building admin applications with a focus on ease of use, customization, and developer experience.

## What Makes Atera Special

- **Full-Featured Dashboard** - Pre-built analytics, orders, customers, finance, inventory, HR, and more
- **Service Layer Architecture** - Easy backend integration with typed interfaces
- **Comprehensive Theming System** - Theme Studio with live preview, presets, accent/neutral colors, radius, typography, density, sidebar, layout, and motion controls
- **Internationalization** - Built-in support for English, German, and French
- **Developer-Friendly** - Comprehensive documentation and clear patterns
- **Production Ready** - Strict TypeScript, linting, unit tests, and a verified build pipeline
- **Local-First Orders** - Orders persist in IndexedDB (Dexie) with export, import, and reset from the Local workspace bar. Other domains remain in-memory mock data.
- **Demo Authentication** - Demo accounts live in `localStorage`; passwords are salted and SHA-256 hashed, but this is not production auth (no server, tokens, or authorization). Replace it before shipping.

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

# Run unit tests
bun run test
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
- **Component System** - 48 UI components built with Radix primitives
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
├── lib/                # Utilities and data modules
│   └── data/          # In-memory mock repositories
├── services/           # Typed service layer (easy backend integration)
├── i18n/               # Internationalization
├── app.css             # TailwindCSS theme and tokens
└── main.tsx           # App entry point
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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
bun run typecheck
```

### Formatting
```bash
bun run format        # write with Prettier
bun run format:check  # verify without writing
```

### Testing
```bash
bun run test        # Vitest unit tests (19 tests)
bun run test:watch  # Vitest in watch mode
bun run test:e2e    # Playwright: full suite on Chromium, smoke on Firefox/WebKit, visual + WCAG AA checks
bun run perf:budget # gzip budget for the initial payload and largest asset
```

The first Playwright run needs the browsers:

```bash
bunx playwright install chromium firefox webkit
```

### Deployment

Atera is a static SPA. Build it with `bun run build` and serve the `dist/` folder.
Because the router uses `createBrowserRouter`, the host must rewrite unknown
paths to `index.html`.

Included configurations:

- `public/_redirects` - Netlify and Cloudflare Pages fallback (`/* /index.html 200`)
- `vercel.json` - Vercel rewrite to `/index.html`

For nginx, add:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

SEO files live in `public/`: `robots.txt` and `sitemap.xml`. Both use
`https://atera.example.com` as a placeholder; replace it with your real domain
before deploying. `index.html` references `/dashboard-preview.png` for social
previews - use an absolute URL if your host does not serve it from the root.

The app requires no environment variables to run. Core Web Vitals reporting is
optional: set `VITE_RUM_ENDPOINT` to a URL and metrics are sent with
`navigator.sendBeacon`; without it, metrics only log in development. If you add
other integrations, expose them through Vite (`VITE_*`) and read them with
`import.meta.env.VITE_*`.

The production build also registers a service worker (`public/sw.js`) and ships
`public/manifest.webmanifest`, so the app installs as a PWA and the shell remains
available offline. Orders already persist locally; other domains still use
in-memory mock data.

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
