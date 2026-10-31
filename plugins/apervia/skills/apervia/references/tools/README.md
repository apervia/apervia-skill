# Notes for the tools that make apps

These notes are extra help. The runtime class from `apervia check` decides
how the app runs, never the name of the tool. An app from a tool with no
notes here goes through the same steps.

| Tool | Signs in the folder | Notes |
| --- | --- | --- |
| Lovable | `lovable-tagger` in `devDependencies`, a Lovable README | [lovable.md](lovable.md) |
| v0 | Next.js, `components/ui` from shadcn, a v0 README | [v0.md](v0.md) |
| base44 | `@base44/sdk` in `dependencies` | [base44.md](base44.md) |
| Bolt | a `.bolt` folder | [others.md](others.md) |
| Replit | a `.replit` file or `replit.nix` | [others.md](others.md) |
| Claude Code, Cursor and others | often nothing | [others.md](others.md) |

Pass the tool to `apervia link --new-app … --tool <tool>` when you know it
(`lovable`, `v0`, `base44`, `bolt`, `replit`, `claude-code`, `cursor`).
