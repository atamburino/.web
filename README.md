# Web Template

React 19 SPA template: Vite 8, TypeScript 6 (strict), TanStack Router (file-based), Redux Toolkit with RTK Query hooks generated from a BFF's OpenAPI spec and validated with zod, shadcn/ui on Tailwind v4, and Vitest in real Chromium.

## Create an app

1. Create a repo from this template, for example `gh repo create my-app --template atamburino/.web --private --clone`.
2. Run `pnpm install`.
3. Run `pnpm init:app --name my-app --title "My App" --api-host https://localhost:5001`.

Init renames the app, points `apiUrl` at `<api-host>/openapi/v1.json`, and pulls the spec if the BFF is running.

## Commands

| Command                                            | What it does                                                       |
| -------------------------------------------------- | ------------------------------------------------------------------ |
| `pnpm dev`                                         | Dev server with the fake BFF (MSW)                                 |
| `pnpm build`                                       | Production build that calls the real BFF                           |
| `pnpm preview:with-fake-bff`                       | Builds with the fake BFF and serves it, no backend needed          |
| `pnpm typecheck`, `pnpm lint`, `pnpm format:check` | Static checks                                                      |
| `pnpm test`                                        | Unit tests in Node and browser tests in Chromium                   |
| `pnpm api:pull`                                    | Fetches `apiUrl` from `template.config.ts` into `api/openapi.json` |
| `pnpm api:generate`                                | Regenerates hooks, zod schemas, and response validation            |
| `pnpm new:feature <name>`                          | Copies `src/features/sampleItems` to a new feature at `/<name>`    |

Run `pnpm exec playwright install chromium` once before the first `pnpm test`.

## Layout

- `src/app`: store, router, providers, layout.
- `src/routes`: file-based routes that only wire features in.
- `src/features/<name>`: one slice per feature. `sampleItems` is the reference to copy, and it is the app's index page at `/`. Replace or extend it with your app's first real screen.
- `src/shared`: API base, generated code, UI components, theme, motion, config.
- `src/fakeBff`: MSW handlers and schema-checked fixtures, used by dev, the fake-BFF build, and tests.

`AGENTS.md` and `.cursor/rules` hold the rules for agents and humans.
