# An image app

`class.id`: `node-server`, `other-server` or `dockerfile`. Source: **image**.

Examples: an Express or Fastify server, a Python, Go, Ruby, Java or Deno
server, a server on the Bun runtime, and every project that needs its own
`Dockerfile`. A build from source does not run these (AC-CLASS-2,
AC-CLASS-3). Docker on the person's computer builds the app into an image,
and the CLI sends it to Apervia and releases it. The person needs Docker,
but no registry and no registry sign-in.

## First: must the app stay an image app?

Answer this before you check Docker. An app that need not be an image app
needs no Docker.

- A `Dockerfile` at the root makes `apervia check` report `dockerfile`.
  Some tools add one to a plain Vite app. If the app is a static bundle or
  Next.js and the Dockerfile only builds and serves it, ask the person
  whether to remove it, so that the platform builds the app from source.
- If the app is a frontend with a small server only for files, ask whether
  the server can go, so that the app is a static bundle.

After the change, run the check again and follow the file of the new class.
Do not check Docker for it. If the app stays an image app, go on below.

## Then: does this computer have Docker?

Read the `docker` part of the `apervia doctor --json` report from step 1 of
the deploy flow. Do this before you change a file for the image.

- `docker.available` is false: Docker is missing, or it does not run. Tell
  the person, in plain words, that this app needs Docker on their computer
  to go on Apervia, and that you can go on when Docker runs. Give them the
  sentence of `docker.reason`: when Docker is missing, it has the link to
  install it (https://docs.docker.com/get-docker/). Then stop. Do not change
  a file of the app, do not create the app on Apervia, and do not deploy.
- `docker.available` is true, but `docker.canBuild` is false: Docker runs,
  but cannot build the image yet. Give the person the sentence of
  `docker.reason`, which says what to do (for example the `docker.amd64`
  check, which can say to start the builder). Ask them to say when it is
  done, run `APERVIA_CLIENT=claude-skill apervia doctor --json` again, and
  go on only when `docker.canBuild` is true.
- `docker.canBuild` is true: tell the person, in one sentence, that
  Docker works and that the CLI builds the app for `linux/amd64`, the kind
  of computer that Apervia runs. Write `linux/amd64` in that sentence. If
  `docker.amd64.mode` is `emulation` (for example a Mac with Apple
  silicon), add that the build works, but is slower than on an Intel or AMD
  computer. Then go on.

## What the image must do

- Listen on `PORT` (`8080`) and `0.0.0.0` (AC-PROC-1, AC-PROC-2), one HTTP
  port (AC-PROC-4).
- Run as a user given by a number: `USER 1000` (AC-SEC-1). No root, no
  `sudo`, no setuid (AC-SEC-2). Write only to `/tmp` or a directory that the
  user owns (AC-SEC-3).
- Start the program directly, or with `exec`, so that it gets `SIGTERM`
  (AC-LIFE-4).
- Be a Linux image for `linux/amd64`. The CLI builds for `linux/amd64`, and
  it refuses an image for another architecture (AC-BUILD-6).

## The Dockerfile

`apervia deploy --push` builds the `Dockerfile` in the folder of the app.
If the app has none (a `node-server` or an `other-server`), write one that
does what the list above says, and a `.dockerignore`. Say why first, and
show both files (rule 5). For a Node.js server, for example:

```dockerfile
FROM node:22-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV NODE_ENV=production
USER 1000
CMD ["node", "server.js"]
```

Use the start file of the app, and the package manager of its lockfile.

The `.dockerignore` keeps `node_modules`, `.git`, `.apervia` and every
`.env*` file out of the image. A secret never goes in the image (rule 1): the
app reads it as a secret of the environment.

## Deploy it

Run, from the folder of the app:

```sh
APERVIA_CLIENT=claude-skill apervia deploy --push --wait --timeout 9m --json
```

The CLI builds the `Dockerfile` for `linux/amd64`, sends the image to
Apervia with a short-lived credential of its own, and releases it. The build
and the send can take some minutes before the release starts; the timeout
counts only the release.

Do not run `docker login`, `docker push` or `apervia registry login`, and
do not ask the person for a registry, a registry user or a registry
password. The CLI needs none of them. Do not show a credential or a token
that a command prints.

If the push fails, the JSON error has a `code`. Read
[../failures.md](../failures.md#when-the-push-fails).

When the developer already publishes the image to a registry that the tenant
can read, deploy that image by digest instead:
`APERVIA_CLIENT=claude-skill apervia deploy --image <registry>/<name>@sha256:<digest> --wait --timeout 9m --json`.

## Deploy on each push to GitHub

To deploy from GitHub Actions on each push, run
`APERVIA_CLIENT=claude-skill apervia github workflow`. It writes a workflow
file and asks the platform to trust it. Show the file to the developer before
the commit.

Apervia gives the file, so it is the file that the console shows, on the
newest release of the deploy action. Do not write the workflow by hand, and
do not change the release in the `uses:` line. If the command does not know
the route, or names an older release than the console, run
`apervia cli update` and run it again.
