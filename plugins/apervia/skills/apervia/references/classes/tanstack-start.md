# TanStack Start

`class.id`: `tanstack-start-nitro` or `tanstack-start-spa`. Source: **build**.

## With Nitro (a server)

`package.json` has `@tanstack/react-start` and `nitro`. The build starts
`node .output/server/index.mjs` (AC-BUILD-4).

- Build with the Nitro preset `node-server`, and keep the output in
  `.output`.
- The server listens on `PORT` and `0.0.0.0` (AC-PROC-1, AC-PROC-2). Nitro
  reads `PORT` and `HOST`; do not set a fixed port in the code.
- Server functions that call an outside API need the host allowed
  ([../outbound.md](../outbound.md)).

## With no Nitro (a single-page app)

`package.json` has `@tanstack/react-start` and no `nitro`. The build serves
`dist/client` as static files.

- Turn on SPA mode in `vite.config.ts`, so that the build writes
  `dist/client/index.html`.
- Treat it like [static-bundle.md](static-bundle.md) for settings: the values
  that the browser reads are build variables.
