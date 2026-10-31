# An image app

`class.id`: `node-server`, `other-server` or `dockerfile`. Source: **image**.

Examples: an Express or Fastify server, a Python, Go, Ruby, Java or Deno
server, a server on the Bun runtime, and every project that needs its own
`Dockerfile`. A build from source does not run these (AC-CLASS-2,
AC-CLASS-3). The developer builds an image, pushes it to a registry, and the
platform runs it.

An image app is for a developer. A person who does not build images cannot
run one: say so, and stop. If the app is a frontend with a small server only
for files, ask whether the server can go, so that the app is a static bundle.

## A root Dockerfile in an app that does not need it

A `Dockerfile` at the root makes `apervia check` report `dockerfile`. Some
tools add one to a plain Vite app. If the app is a static bundle or Next.js
and the Dockerfile only builds and serves it, ask the person whether to
remove it, so that the platform builds the app from source. Run the check
again after the change.

## What the image must do

- Listen on `PORT` (`8080`) and `0.0.0.0` (AC-PROC-1, AC-PROC-2), one HTTP
  port (AC-PROC-4).
- Run as a user given by a number: `USER 1000` (AC-SEC-1). No root, no
  `sudo`, no setuid (AC-SEC-2). Write only to `/tmp` or a directory that the
  user owns (AC-SEC-3).
- Start the program directly, or with `exec`, so that it gets `SIGTERM`
  (AC-LIFE-4).
- Be a Linux image for the platform's architecture, usually `linux/amd64`.

## Deploy it

1. The tenant must have a registry credential for the host of the image, or
   the image must be public (AC-BUILD-6). If a pull fails with `image-pull`,
   an administrator of the tenant adds the registry in the console.
2. Push the image, and get its digest:

   ```sh
   docker buildx build --platform linux/amd64 -t <registry>/<name>:<tag> --push .
   docker buildx imagetools inspect <registry>/<name>:<tag> --format '{{json .Manifest.Digest}}'
   ```

3. Deploy by digest:
   `APERVIA_CLIENT=claude-skill apervia deploy --image <registry>/<name>@sha256:<digest> --wait --timeout 9m --json`.

To deploy from GitHub Actions on each push, run
`APERVIA_CLIENT=claude-skill apervia github workflow`. It writes a workflow
file and asks the platform to trust it. Show the file to the developer before
the commit.
