# Lovable

A Lovable app is usually a Vite and React static bundle
([../classes/static-bundle.md](../classes/static-bundle.md)) that calls a
Supabase project from the browser.

## The repository

- Lovable can sync the project to GitHub (in Lovable: GitHub, Connect). Use
  that repository when the person has it. Each change in Lovable then pushes,
  and each push builds on Apervia.
- If the person downloaded the code with no repository, follow
  [../repository.md](../repository.md).

## Settings

- The Supabase values are build variables: `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_PUBLISHABLE_KEY` (older apps: `VITE_SUPABASE_ANON_KEY`), and
  sometimes `VITE_SUPABASE_PROJECT_ID`. They are public keys by design
  (AC-CFG-2).
- Lovable commits a `.env` file with these public values. It can stay
  (AC-BUILD-5), and the build reads it. If the person wants the values on
  Apervia instead, set them with `apervia config set --build` and remove the
  file from git.
- Some apps write the URL and the key in `src/integrations/supabase/client.ts`.
  That is also only public values.
- A Supabase service role key must never be in the app. If you see one in the
  code or in `.env`, stop, tell the person, and help them rotate it in
  Supabase.

## Supabase

- Add the address of the environment to the redirect URLs of the Supabase
  project, if the app signs people in with Supabase Auth.
- Supabase Edge Functions stay in Supabase. They do not run on Apervia.
- To move the data to Apervia, see [../import.md](../import.md). It must
  happen before the first release of the environment.

## Known faults

- A `Dockerfile` that only serves the Vite build: remove it, so that the app
  builds from source (see [../classes/image.md](../classes/image.md)).
- A `bun.lockb` and a `package-lock.json` together: the build uses the
  package manager that `package.json` names, or else the first lockfile in
  its order (AC-BUILD-2). Keep the lockfile of the package manager that the
  project uses, and remove the other.
