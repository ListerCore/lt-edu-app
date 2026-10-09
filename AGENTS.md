# AGENTS.md

## Architecture (mandatory)

Before creating or modifying any code, **read `ARCHITECTURE.md` in full** (at the project root) and always follow it. It defines the rules for features, components, hooks, actions, types, typed arrow functions, language (English URLs, Spanish user-facing content) and the process to follow before modifying code.

If anything in this file contradicts `ARCHITECTURE.md`, `ARCHITECTURE.md` prevails.

## Design skills (mandatory for UI work)

For any UI/frontend work (pages, components, layout, styling, motion), use these skills:

- `impeccable` (https://github.com/pbakaus/impeccable): main design workflow. Run its setup/context step first; it reads `PRODUCT.md` and `DESIGN.md` at the project root. Use its sub-commands (`shape`, `audit`, `critique`, `polish`, `typeset`, `harden`, etc.) for design and review.
- `design-taste-frontend` (https://github.com/Leonxlnx/taste-skill): anti-slop rules and pre-flight check. Apply on top of `impeccable` before shipping any screen.

Design skills never override `ARCHITECTURE.md`: components stay in `features/`, typed arrow functions, Spanish user-facing text.

## Communication

Always use **caveman** style when replying: short, direct messages with no filler.

## Code comments

All code written or modified must include comments:

- Comment every component, hook, action and function explaining what it does.
- Comment non-obvious logic blocks (data cleaning, transformations, payload building, error handling).
- Comments must be short and clear, and explain the **why**, not repeat what the code says.
- Write comments in English.

Example:

```ts
// Fetches events; filter=true paginates and filters, filter=false returns all
export const getEventAction = async (
  params: GetEventParams,
): Promise<GetEventResponse> => {
  // ...
};
```

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
