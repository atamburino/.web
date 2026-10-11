# Agent guide

Read these before you change code:

- `.cursor/rules/typescript.mdc` for type, boundary, and test rules.
- `.cursor/rules/frontend-architecture.mdc` for feature slices, the API flow, routing, state, and styling.

`src/features/sampleItems` renders the index route (`/`) and is the reference slice. To add a feature, run `pnpm new:feature <name>`. It creates the feature at `/<name>`. Then follow the lint errors.

Before you finish, run `pnpm typecheck && pnpm lint && pnpm format:check && pnpm test && pnpm build`.
