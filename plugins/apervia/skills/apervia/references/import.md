# Import the data of a Lovable app

A Lovable app keeps its data in a Supabase project. The CLI can copy that
data into an environment on Apervia, with a Supabase add-on. Ask the person
first: the data then lives on Apervia, and the app uses the new copy.

The import must happen **before the first release** of the environment. An
environment that has a release cannot take an import. If the environment
already has one, make a new environment (`apervia env create <Name>`), and
import into it.

## Get the export

The person downloads a backup of the database from Supabase, or from
Lovable. It is a `.backup` file, or a zip that holds one. If the app stores
files in Supabase Storage, the person also downloads a zip of the files of
each bucket. The skill does not log in to Supabase for the person.

## Run the import

1. Attach the Supabase add-on first, if the environment does not have one
   ([addons.md](addons.md)).
2. Run:

   ```sh
   APERVIA_CLIENT=claude-skill apervia import start <export> --json
   ```

   - With stored files, give the zip of each bucket:
     `--files avatars=avatars.zip`. To go on without the files, add
     `--skip-files`. Ask the person.
   - A large export can take a long time to upload. If the command stops,
     run it again with the same file: it sends only the part that the
     platform does not have.
3. Run `APERVIA_CLIENT=claude-skill apervia import status --json`. It shows
   the records, the tables and the people that the export holds.
4. With the alias `SUPABASE`, the platform gives the build the address and
   the public key of the new Supabase, under the names that a Lovable app
   reads ([addons.md](addons.md)). Remove any build variable with those
   names that you set before.
5. Deploy. The platform copies the data after the first release, and keeps
   the environment closed until the copy is complete.

If the copy fails, `apervia import status` says why. `apervia import retry`
tries it again.

## The people of the old app

The people who signed in to the old app are in the export, and the import
keeps their accounts in the new Supabase. The CLI does not invite them to the
tenant. To let them open the app, an administrator invites them in the
console, and a builder shares the app with them ([sharing.md](sharing.md)).
