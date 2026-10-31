# A Next.js server

`class.id`: `nextjs`. Source: **build**.

Example: an app from v0, or a developer's Next.js app.

## What the build does

It installs, runs the `build` script, and starts the app with
`next start --port 8080 --hostname 0.0.0.0` (AC-BUILD-4). A `Procfile` with a
`web:` line replaces that command; it must still listen on `PORT` and
`0.0.0.0` (AC-PROC-1, AC-PROC-2).

## What to check

- `package.json` at the root, with a `build` script (`next build`). With no
  `build` script the build fails at once (AC-BUILD-3).
- `NEXT_PUBLIC_*` values are build variables (AC-CFG-1). Other values that the
  server reads are runtime settings, or secrets.
- `output: "export"` in `next.config.*` makes a static export: then the app has
  no server. Ask the person whether that is wanted.
- The server code (route handlers, server actions, `getServerSideProps`) that
  calls an outside API needs that host allowed (AC-NET-1, see
  [../outbound.md](../outbound.md)). Find the hosts:

  ```sh
  grep -rhoE "https://[a-zA-Z0-9.-]+" app pages src lib 2>/dev/null | sort -u
  ```

  A call from a client component (`"use client"`) needs no approval.
- A call to OpenAI or Anthropic from the server: use the AI add-on, and remove
  any key or base URL from the code (AC-NET-3, AC-ADDON-3).
- Middleware or code that signs people in with its own page: the platform
  signs every person in first (AC-ID-4). Read the person from the headers in
  [../contract.md](../contract.md).
- Files written at run time (uploads, a SQLite file) are lost at each restart
  (AC-LIFE-3). Use an add-on.
