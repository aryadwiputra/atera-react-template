# Atera Design System

Reference for building UI in Atera. Source of truth is `src/app.css` (Tailwind v4 `@theme` + CSS custom properties). This document describes the tokens, the conventions for using them, and the known gaps as of 2026-11-21.

## Principles

1. **Flat-first.** Depth comes from borders and background contrast, not shadows. Shadows are reserved for floating elements.
2. **Neutral base, swappable accent.** The palette is grayscale; color enters through the `data-color` preset, status tokens, and chart tokens.
3. **Tokens over raw values.** Use semantic classes (`bg-background`, `text-muted-foreground`, `border-border`, `rounded-md`). Never hard-code hex values or oklch strings in components.
4. **Radix primitives first.** Compose from `src/components/ui/` before adding a new component system.

## Color

All colors are `oklch`, defined in `:root` (light) and `.dark`, mapped to Tailwind via `@theme` (`--color-*` → `bg-*`, `text-*`, `border-*`).

### Semantic tokens

| Token | Class | Light | Dark | Use |
|---|---|---|---|---|
| background | `bg-background` | 1.0 | 0.075 | Page background |
| foreground | `text-foreground` | 0.145 | 0.985 | Primary text |
| card | `bg-card` | 1.0 | 0.19 | Cards, panels |
| popover | `bg-popover` | 1.0 | 0.21 | Dropdowns, dialogs |
| primary | `bg-primary` | 0.205 | 0.922 | Primary buttons, active states; near-black in light, near-white in dark |
| secondary | `bg-secondary` | 0.965 | 0.235 | Secondary buttons |
| muted | `bg-muted` | 0.965 | 0.235 | Muted surfaces, skeletons |
| muted-foreground | `text-muted-foreground` | 0.556 | 0.556 | Secondary text |
| accent | `bg-accent` | 0.965 | 0.235 | Hover states |
| destructive | `bg-destructive` | 0.577 0.245 27.3° | same | Destructive actions, errors |
| border / input | `border-border` / `border-input` | 0.922 | 0.28 | Borders and input outlines (identical) |
| ring | `ring-ring` | 0.708 | 0.556 | Focus rings |

A global `* { border-border }` in `@layer base` means every element defaults to the border color; only set `border` widths explicitly.

### Status tokens (project-specific)

Use for badges, alerts, and inline status indicators instead of ad-hoc greens/yellows/reds:

| Token | Class | Light | Dark |
|---|---|---|---|
| success | `text-status-success` | 0.627 0.169 149.2° | 0.765 0.177 163.2° |
| warning | `text-status-warning` | 0.681 0.162 75.8° | 0.795 0.184 86.0° |
| danger | `text-status-danger` | 0.577 0.245 27.3° | 0.704 0.191 22.2° |
| swatch | `bg-swatch` | follows preset | follows preset |

### Color presets

Six presets set via `data-color` on `<html>` (managed by `use-customize-preferences`): **zinc** (default), **blue**, **violet**, **rose**, **orange**. Each overrides `--primary`, `--ring`, `--sidebar-primary`, `--swatch`, and `--chart-1..5`.

### Chart palette

`chart-1` … `chart-5`, themed separately for light (warm, e.g. orange/teal/navy/amber/rose) and dark (more saturated, e.g. blue/green/amber/purple/red). Charts must use `var(--chart-N)` via the Tailwind classes (`fill-chart-1`, `stroke-chart-2`), never raw hex.

## Border radius

Derived from one variable, `--radius: 0.625rem` (10px):

| Token | Value | Usage |
|---|---|---|
| `rounded-xs` | 4px | Tiny inline elements |
| `rounded-sm` | 6px | Small chips, subtle inset |
| `rounded-md` | 8px | Buttons, inputs, small controls |
| `rounded-lg` | 10px | Cards, dialogs, dropdowns, sheets |
| `rounded-full` | pill | Avatars, badges, toggles, scrollbar thumb |

Rule: **inner elements use a smaller radius than their container** (`rounded-md` inside `rounded-lg`).

## Spacing

Standard Tailwind scale (4px base). No custom spacing tokens. Measured usage across components and pages:

| Class | Value | Primary use |
|---|---|---|
| `gap-0.5` / `gap-1` / `gap-1.5` | 2 / 4 / 6px | Icon-to-label, tight stacks |
| `gap-2` | 8px | Default gap between controls (dominant: ~185 uses) |
| `gap-2.5` / `gap-3` | 10 / 12px | Button internals, list rows |
| `gap-4` | 16px | Card content, grid columns |
| `gap-5` / `gap-6` | 20 / 24px | Section separation |
| `gap-8` / `gap-10` | 32 / 40px | Page-level blocks (rare) |

Sizing (from `button.tsx`, apply to similar controls):

| Control | Height | Padding |
|---|---|---|
| Button default | `h-9` (36px) | `px-4` |
| Button sm | `h-8` (32px) | `px-3` |
| Button lg | `h-10` (40px) | `px-6` |
| Button icon | `size-9` | — |
| Internal icons | `size-4` (16px) | — |

## Density

`data-density` on `<html>` sets `--density-space` (compact 0.75, comfortable 1, spacious 1.25). Two classes consume it, wired into the five dashboard pages (`dashboard.tsx`, `analytics.tsx`, `ecommerce.tsx`, `crm.tsx`, `saas.tsx`):

- `.dashboard-content` on `<main>` — `gap: calc(1.5rem * var(--density-space, 1))` (replaces `gap-6`)
- `.dashboard-section` on each grid block — `gap: calc(1rem * var(--density-space, 1))` (replaces `gap-4`)

New dashboard-style pages must use these classes instead of static `gap-6`/`gap-4`. Non-dashboard pages use static spacing and do not respond to the density preference; extend these classes if density should be global.

## Typography

- `--font-sans`: system stack (`ui-sans-serif, system-ui, sans-serif, …`). No brand font.
- Scale: Tailwind defaults + one addition, `text-2xs` (0.625rem / 1rem line-height) for micro-labels.
- Editor (Tiptap) prose has its own scale in `src/app.css`: h1 1.875rem, h2 1.5rem, h3 1.25rem, line-height 1.7, letter-spacing -0.02em on headings.

## Shadows & elevation

| Token | Usage |
|---|---|
| `shadow-xs` | Buttons, inputs (default elevation) |
| `shadow-sm` / `shadow-md` | Small floating elements |
| `shadow-lg` | Dropdowns, popovers, dialogs |
| `shadow-none` | Flat cards and surfaces (preferred) |

Cards are separated by `border-border`, not shadow.

## Layout

- App shell: sidebar layout or top-nav layout, selected by preference (`src/layouts/app-layout.tsx`).
- `[data-container='boxed'] main` → `max-width: 1280px`, centered. Default is full-width.
- Scrollbars: 5px thin, custom-styled (`html`, `.sidebar-scroll`) via `color-mix` on foreground at 25% opacity.

## Theming mechanics

`src/main.tsx` calls `initializeTheme()` and `initializeCustomizePreferences()` before render. Both write attributes to `<html>`:

- `class="dark"` — light/dark/system
- `data-color="zinc|blue|violet|rose|orange"` — accent preset
- `data-density="compact|comfortable|spacious"` — spacing multiplier
- `data-container="boxed|full"` — content width

Preferences persist in `customize_*` cookies and a localStorage key; see `src/hooks/use-customize-preferences.tsx`.

## Conventions for new UI

1. Use semantic tokens, never raw colors.
2. Gap: `gap-2` between controls, `gap-4` inside cards, `gap-6` between sections.
3. Radius: `rounded-md` controls, `rounded-lg` surfaces, `rounded-full` pills.
4. Compose from `src/components/ui/`; style variants with `cva` + `cn()`.
5. Charts use `chart-1..5` tokens; status uses `status-*` tokens.
6. New tokens go in `src/app.css` `@theme` (mapping) + `:root`/`.dark` (values) — and must be added to both light and dark blocks.

## Known gaps

1. **Light-mode cards are flat by design.** `--card` equals `--background` (both pure white); cards rely on border only. Kept intentionally per the flat-first principle.
2. **No brand font.** System stack only; a display font would differentiate the template.
3. **`--swatch` is preset-only**, not used by base `:root` consumers.
