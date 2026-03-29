# Agent Guidelines

This file provides instructions for AI coding assistants working on this repository.

## Commit Messages

Always use [Conventional Commits](https://www.conventionalcommits.org/):

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

Rules:

- Lowercase throughout
- Imperative mood: "add" not "added"
- Scope optional but encouraged — use the component or module name
- Summary under 72 characters, no trailing period

## Package Manager

Use `pnpm`. Never use `npm` or `yarn`.

## General

- See `CONTRIBUTING.md` for full dev setup, code style, and PR guidelines.

## Documentation

Project docs live in `docs/`:

| File                     | Contents                                                     |
| ------------------------ | ------------------------------------------------------------ |
| `docs/OPTIONS.md`        | All user-configurable options and their defaults             |
| `docs/QualityOfLife.md`  | Quality of life improvements over the original Flash website |
| `docs/TechnicalNotes.md` | Implementation details                                       |
