# A static bundle

`class.id`: `static-bundle`. Source: **build**.

Examples: a Vite app, most apps from Lovable, base44, Bolt and other app
builders, a Create React App project. The browser code calls its backend (for
example Supabase) directly. The server only serves files.

## What the build does

1. It installs with the package manager that `package.json` names, or else
   the lockfile. With the GitHub way, commit the lockfile (AC-BUILD-2). With
   the upload, keep it in the folder, and make no git repository.
2. It runs the `build` script (AC-BUILD-3).
3. It serves the folder `dist` as static files. Each unknown path gets
   `index.html`, so a client-side router works (AC-BUILD-4).

## What to check

- `package.json` is at the root of the folder, and has a `build` script.
  A project in a subfolder does not build: ask the person whether to move it
  to the root.
- The build writes `dist/index.html`. A project whose build writes to another
  folder (for example `build/` for Create React App) needs the build variable
  `BP_WEB_SERVER_ROOT` set to that folder, or a change to the output folder.
- Every value that the browser code reads from `import.meta.env` or
  `process.env` is a **build variable** (AC-CFG-1). Find them:

  ```sh
  grep -rhoE "import\.meta\.env\.[A-Z0-9_]+|process\.env\.[A-Z0-9_]+" src | sort -u
  ```

  Set each one with `apervia config set --build NAME=value` before the first
  build. A value that is secret must not be in the browser code at all
  (AC-CFG-2): move that call to a server, or tell the person.
- A `.env` file: see AC-BUILD-5 in [../contract.md](../contract.md). The
  upload never holds a `.env` file
  ([../upload.md](../upload.md)), so set each of its public values as a
  build variable before the first build. A secret in it is never a build
  variable.
- No server code runs. An Express server in the project is a different class
  (`node-server`).

## The backend

When the browser calls a backend such as Supabase:

- No outbound host is needed (AC-NET-5).
- Tell the person to add the address of the environment to the allowed
  redirect URLs of the backend (for Supabase: Authentication, URL
  Configuration), when the app signs people in through it.
- For a Lovable app with Supabase, the person can also move the data to
  Apervia: see [../import.md](../import.md). Ask first. It must happen before
  the first release.
