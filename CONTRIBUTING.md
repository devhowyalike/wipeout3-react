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

## Testing

The project uses [Vitest](https://vitest.dev/) with [jsdom](https://github.com/jsdom/jsdom) and [Testing Library](https://testing-library.com/docs/react-testing-library/intro).

```bash
pnpm test          # single run
pnpm test:watch    # watch mode
```

Tests run automatically before every `pnpm build`, so a failing test blocks the production build.

## How to Contribute

### Reporting Issues

- Search [existing issues](https://github.com/devhowyalike/wipeout3-react/issues) before opening a new one.
- Include clear steps to reproduce, your browser/OS, and any relevant console output.

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/). All commit messages must follow the format:

```
<type>(<scope>): <short summary>
```

| Type       | When to use                                             |
| ---------- | ------------------------------------------------------- |
| `feat`     | New feature                                             |
| `fix`      | Bug fix                                                 |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `style`    | Formatting, whitespace — no logic change                |
| `chore`    | Build process, deps, tooling, config                    |
| `docs`     | Documentation only                                      |
| `perf`     | Performance improvement                                 |
| `ci`       | CI/CD changes                                           |

**Examples:**

```
feat(ship): add boost pad collision detection
fix(ui): correct lap timer overflow on long races
chore(deps): update vite to v6
refactor(audio): extract engine sound manager
```

- Use lowercase throughout
- Summary is imperative mood: "add" not "added"
- Scope is optional but encouraged — use the component or module name
- Keep summary under 72 characters, no trailing period

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

## Technical Notes

For implementation details see [Technical Notes](docs/TechnicalNotes.md).
