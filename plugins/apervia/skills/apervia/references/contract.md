# The app contract, in plain words

`apervia check` names a rule by its identifier, for example `AC-PROC-1`. This
file says what each rule asks of the app, so that you can fix the app and
explain the fix. It does not say how the platform works inside. Do not guess
that, and do not tell the person a guess.

To see the rules that the CLI checks, with the version of the contract, run
`APERVIA_CLIENT=claude-skill apervia check --rules`. That list decides. If
this file and that list differ, follow the list, and use the `message` and
the `fix` of each finding.

A `must` rule: the app does not build, does not start, or is not safe. A
`should` rule: the app runs, but it can fail later.

## The port

- **AC-PROC-1.** The web process listens for HTTP on the port in the variable
  `PORT` (the value is `8080`). Read `PORT` from the environment. Do not
  write the number in the code. Serve plain HTTP: the platform gives the
  HTTPS address.
- **AC-PROC-2.** Listen on `0.0.0.0`, not on `localhost` or `127.0.0.1`. For
  example `next start --hostname 0.0.0.0`, `vite preview --host 0.0.0.0`.
- **AC-PROC-3.** Do not listen on port `15001` or `15021`. The platform uses
  them.
- **AC-PROC-4.** One inbound port, HTTP or WebSocket only. No second port, no
  raw TCP, UDP or gRPC from outside.
- **AC-PROC-5.** A worker (a background process) gets no requests. It gets its
  work from an add-on, such as a queue in the cache or a table in the
  database, or from a schedule in its own code.

## The image

- **AC-SEC-1.** The image runs as a user that is not root, given by a number:
  `USER 1000`, not `USER node`. A build from source does this already.
- **AC-SEC-2.** No `sudo`, no `su`, no setuid, no extra capability, no Docker
  inside the app.
- **AC-SEC-3.** The app writes only where its user may write, for example
  `/tmp` or a directory that the image gives to its user.

## Builds

- **AC-BUILD-1.** A build from source ignores a `Dockerfile`. An app that needs
  its Dockerfile is an image app.
- **AC-BUILD-2.** A build from source needs a Node.js project with
  `package.json` at the root of the repository. The build uses the package
  manager that `package.json` names, or else the lockfile. The lockfile must
  be in the source: with the GitHub way, commit it; with the upload, it is in
  the folder.
- **AC-BUILD-3.** The build runs the `build` script of `package.json`.
- **AC-BUILD-4.** What starts depends on the project: Next.js runs
  `next start`; TanStack Start with Nitro runs `.output/server/index.mjs`;
  TanStack Start with no Nitro and every other project is served as static
  files from `dist` (TanStack Start: `dist/client`). The output must hold an
  `index.html`. Unknown paths get `index.html`, so a client-side router works.
- **AC-BUILD-5.** No secret in the repository. Put `.env*` in `.gitignore`. A
  `.env` file that is already in the repository can stay when it holds only
  public build values (for example the public keys of a Supabase project) or
  empty values. A `.env` file with a secret value must go, and the person must
  change (rotate) that secret, because the history of the repository still
  holds it.
- **AC-BUILD-6.** An image app deploys an image by digest, from a registry
  that the tenant can read. The image is for Linux.

## Settings

There are three kinds:

| Kind | The app reads it | Who can read it back |
| --- | --- | --- |
| Runtime setting | When it starts | The builders, in the console and the CLI |
| Secret | When it starts | Nobody. The CLI shows only the name |
| Build variable | During the build only | The builders, and every visitor if the browser code uses it |

- **AC-CFG-1.** A value that the browser code needs is a build variable:
  `VITE_*`, `NEXT_PUBLIC_*`, `REACT_APP_*` and the like. A runtime setting with
  such a name does nothing. A change to a build variable needs a new build.
- **AC-CFG-2.** A build variable is never a secret. A key that is public by
  design, such as `VITE_SUPABASE_ANON_KEY`, can be one.
- **AC-CFG-3.** A server value is a runtime setting, or a secret when it is
  secret. Each environment has its own settings.
- **AC-CFG-4.** Do not set `PORT` or a name that starts with `APERVIA_`.
- **AC-CFG-5.** Do not set a name that an add-on gives (see
  [addons.md](addons.md)).
- **AC-CFG-6.** A name has letters, digits and underscores only, and does not
  start with a digit. At most 128 characters, and 200 names.

## Who the person is

Every person is signed in before a request reaches the app. The app gets
these request headers, and a visitor cannot forge them:

| Header | Value |
| --- | --- |
| `X-Apervia-User-ID` | The person. It never changes |
| `X-Apervia-User-Email` | The email, when there is one |
| `X-Apervia-Tenant-ID` | The tenant |
| `X-Apervia-Token-ID` | An identifier for a log line |
| `X-Apervia-Env` | The environment |
| `X-Apervia-App-Permissions` | The permissions of this app that the person has, comma-separated |
| `X-Apervia-App-Roles` | The teams of the person that the app is published to, on the live environment only |

- **AC-ID-1.** Trust these headers, and only these.
- **AC-ID-2.** Identify a person by `X-Apervia-User-ID`, not by the email.
- **AC-ID-3.** Decide what a person may do from `X-Apervia-App-Permissions`.
  The builders create the permissions (see [sharing.md](sharing.md)).
- **AC-ID-4.** No sign-in page of the app's own for these people. An app can
  keep separate accounts for its own data (for example Supabase Auth).
- **AC-ID-5.** Set no `Domain` on a cookie. The platform reserves one prefix
  of cookie names for its own sign-in; `apervia check` names it when the app
  uses it. Rename that cookie.
- **AC-ID-6.** Test with `apervia emulator start --target <port>`, which gives
  the app the same headers on the laptop. Do not add a code path that makes up
  a person when the headers are absent.

## Health, sleep and restarts

- **AC-LIFE-1.** Open the port only when the app can serve. The app has up to
  5 minutes to start. A health path (if the builders set one) answers with no
  identity headers, shows no data and changes nothing.
- **AC-LIFE-2.** Start in a few seconds. An environment that nobody uses can
  sleep, and the next visitor waits for the start.
- **AC-LIFE-3.** Keep no data in the app's own files. The files start empty at
  each release and restart. Keep data in an add-on.
- **AC-LIFE-4.** Stop cleanly on `SIGTERM`, in about 25 seconds. Start the
  program with `exec`, not inside `sh -c`.
- **AC-LIFE-5.** An open stream or WebSocket keeps the environment awake.

## Outside connections

- **AC-NET-1.** The server of the app reaches an outside host only through the
  proxy in `HTTPS_PROXY`, after a builder allows the host (see
  [outbound.md](outbound.md)). Use an HTTP client that reads `HTTPS_PROXY`.
- **AC-NET-2.** Only TLS, to a DNS name. No plain HTTP, no IP address, no mail
  ports.
- **AC-NET-3.** OpenAI and Anthropic only through the AI add-on.
- **AC-NET-4.** Email only through the email add-on.
- **AC-NET-5.** A call from the browser to an outside API needs no approval.

## Add-ons

- **AC-ADDON-1.** Read each add-on value from the environment when the app
  starts. Keep no copy in a file, the code or a build variable.
- **AC-ADDON-2.** Read the names with the alias that the environment uses.
- **AC-ADDON-3.** The AI add-on gives `OPENAI_BASE_URL`, `OPENAI_API_KEY`,
  `ANTHROPIC_BASE_URL` and `ANTHROPIC_API_KEY`. The official SDKs read them
  with no change. Set no key or base URL in the code.
- **AC-ADDON-4.** The email add-on gives SMTP settings under its alias. Do not
  require TLS or STARTTLS. Send from `<ALIAS>_FROM`, or another address on the
  sending domain of the tenant.
- **AC-ADDON-5.** File storage: the browser uses `<ALIAS>_ENDPOINT`, the server
  uses `<ALIAS>_S3_ENDPOINT`, with path-style requests. The secret key is
  never a build variable.

## What runs

- **AC-CLASS-1.** A static bundle (most app builders, a Vite app) is a build
  app.
- **AC-CLASS-2.** A Node.js server is a build app only when it is Next.js or
  TanStack Start with Nitro. Express and other Node.js servers are image apps.
- **AC-CLASS-3.** A server in another language (Python, Go, Ruby, Java, Deno,
  the Bun runtime) is an image app.
- **AC-CLASS-4.** These do not run on Apervia: an app that must run as root,
  needs Docker inside it, needs a port that is not HTTP or more than one port,
  keeps its data on its own disk, or calls an outside host with no TLS.
- **AC-CLASS-5.** An app whose backend stays with its tool (for example
  base44) keeps that backend. Apervia hosts the frontend only.
