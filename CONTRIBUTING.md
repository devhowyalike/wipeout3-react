# Contributing

Thank you for your interest in contributing to **wipeout3.com: React Edition**. This guide covers everything you need to get the project running locally and how to contribute changes.

## Prerequisites

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io)
- [Git](https://git-scm.com/)

## Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/devhowyalike/wipeout3-react.git
cd wipeout3-website
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Setup

All configuration is handled at runtime through the Options menu (see [`docs/OPTIONS.md`](docs/OPTIONS.md)). Environment variables control the site URL, title, description, and an optional [Web3Forms](https://web3forms.com/) access key (only needed if the `contactModal` option is enabled).

1. Find the `.env.example` file in the root directory
2. Create a new file named `.env` in the same directory
3. Copy the contents and update any values as needed:

```bash
VITE_SITE_URL=http://localhost:5173
VITE_SITE_TITLE=wipeout3.com: React Edition
VITE_SITE_DESCRIPTION=A faithful JavaScript recreation of the original 1999 Wipeout 3 Flash website by The Designers Republic, Kleber, and Psygnosis.
VITE_WEB3FORMS_ACCESS_KEY=your_access_key_here
```

> [!NOTE]
> The `.env` file is included in `.gitignore` and should never be committed to version control.

### 4. Start the development server

```bash
pnpm dev
```

## Building for Production

```bash
pnpm build
```

## Linting

```bash
pnpm lint
```

## Technical Notes

### Critical CSS Injection

To prevent a flash of unstyled content (FOUC) when the page first loads, a `<style>` block is injected into the `<head>` of `index.html` at transform time by the `injectCriticalThemeCSS` Vite plugin defined in `vite.config.ts`.

The plugin runs during both `pnpm dev` and `pnpm build`. It reads two source files at transform time to derive the injected styles:

| Source                    | What is read                                                        |
| ------------------------- | ------------------------------------------------------------------- |
| `src/styles/index.css`    | `--color-page-bg` value for every `[data-theme]` selector           |
| `src/config/constants.ts` | `DEFAULT_THEME` identifier, used to set `:root { --color-page-bg }` |

The resolved CSS is injected as a `<style>` tag prepended to `<head>`. It contains per-theme background color rules, `body { background-color: var(--color-page-bg) }`, `#root { visibility: hidden }` (so the page is invisible until the full CSS bundle arrives), and the critical `@font-face` declaration for the Wipeout3 font.

Because the values are derived from the actual CSS and constants files, adding or modifying a theme in `index.css` is automatically reflected in the injected block with no manual updates required.

### Converting Complex Flash Animations

#### SVGs

Where possible, efforts were made to convert Flash animations to animated SVGs. These maintain the vector nature of the original animation, are easy to work with and make interactive, and remain accessible in modern browsers. This applies to pages such as the Teams landing page and Tracks, for example.

## How to Contribute

### Reporting Issues

- Search [existing issues](https://github.com/devhowyalike/wipeout3-react/issues) before opening a new one.
- Include clear steps to reproduce, your browser/OS, and any relevant console output.

### Submitting a Pull Request

1. Fork the repository and create a branch from `main`.
2. Keep changes focused — one feature or fix per PR.
3. Run `pnpm lint` and resolve any errors before submitting.
4. Test your changes across browsers and at multiple screen sizes where relevant.
5. Open the PR against `main` with a clear description of what was changed and why.

### Code Style

- This project uses TypeScript. Avoid `any` unless genuinely unavoidable.
- Follow the existing naming and file structure conventions.
- Accessibility matters — preserve or improve `aria` attributes, keyboard navigation, and `prefers-reduced-motion` support when touching relevant components.
- Do not commit `.env` files or build artifacts.
