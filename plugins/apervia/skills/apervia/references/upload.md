# Upload the folder of a build app

A build app (a static bundle, Next.js, TanStack Start or a static site)
needs no GitHub and no Docker. `apervia deploy --upload` packs the folder,
sends it to Apervia, and Apervia builds it. The person needs no GitHub
account, no git repository and no Docker. Do not make a git repository for
the upload, and never ask the person to make a GitHub account.

## What the CLI leaves out

The CLI follows `.gitignore` and `.apervia-ignore` in each folder. Whatever
those files say, it always leaves out `.git`, `node_modules`, every `.env*`
file (also `.env.example`), private keys, credential folders such as `.ssh`
and `.aws`, a `.npmrc` with a token, and each file that holds a private key.
It lists each file that it leaves out as a secret in `upload.skipped`, with
the reason. It does not list `.git`, `node_modules`, or the files of the
ignore rules.

So the build never reads a `.env` file. Before the deploy, set each public
value that the app reads from `.env` as a build variable on Apervia:

```sh
APERVIA_CLIENT=claude-skill apervia config set --build VITE_SUPABASE_URL=https://abcdefgh.supabase.co
```

Read the names in `.env` first, with no value:
`grep -oE '^[A-Za-z_][A-Za-z0-9_]*=' .env`. Then read the line of each name
that is public by design, one name at a time
(`grep '^VITE_SUPABASE_URL=' .env`), and never the line of another name (see "Is it a secret?" in [configuration.md](configuration.md)). A secret
in `.env` is never a build variable (rule 1 in [../SKILL.md](../SKILL.md)).
If the app needs it on a server, set it as a secret: the person types it.

## Before the upload

1. Make sure that `.gitignore` exists and holds at least these lines, so
   that a later commit cannot take a secret either. Show the change.

   ```
   .env
   .env.*
   !.env.example
   node_modules/
   dist/
   .apervia/
   ```

2. List the files. With no `--yes`, the CLI uploads nothing:

   ```sh
   APERVIA_CLIENT=claude-skill apervia deploy --upload --wait --timeout 9m --json
   ```

   The JSON document has `upload.files` (each with `path` and `size`),
   `upload.skipped`, `upload.size` and `upload.compressed`, and the error
   code `upload_needs_yes`. That code is expected here.

3. Read every path in `upload.files`. None can be a file that holds a
   secret: a `.env` file of any name, `*.pem`, `*.key`, `*.p12`,
   `credentials.json`, a service account file, `id_rsa` or another SSH
   key, a `.npmrc` or `.yarnrc.yml` with a token, a SQLite or other
   database file, a backup or a dump. If one is there, add its path to
   `.apervia-ignore` (make the file if it is missing), say why, and list
   again. Never upload while such a file is in the list.

4. Look for secret values in the files of the list. The command prints
   only the names of the files. Show the person the file, never the value:

   ```sh
   grep -lIE "(sk-[A-Za-z0-9]{20,}|sk_live_|-----BEGIN [A-Z ]*PRIVATE KEY|service_role|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36})" <the paths of upload.files>
   ```

   If there is one, remove it from the file, keep the value out of the
   transcript, and set it as a secret on Apervia
   ([configuration.md](configuration.md)). A secret in the browser code is
   a fault in the app (AC-CFG-2): tell the person.

5. Show the person the list, in plain words: the number of files and their
   size, the folders and the files at the top of the folder, and each file
   that the CLI or you left out, with the reason. Say that no `.env` file and
   no secret is in it. Then ask: "Shall I send these files to Apervia and
   build the app?"

## The upload

On a "yes", run:

```sh
APERVIA_CLIENT=claude-skill apervia deploy --upload --yes --wait --timeout 9m --json
```

Give `--yes` only after the person said yes to this list. If you changed a
file since the list, list again first. The CLI follows the build and the
release. If the upload or the build is refused, read
[failures.md](failures.md#when-the-upload-or-the-push-fails).

To deploy a change later, list again, show what changed in the list, and
upload with `--yes`.

## A folder that is already in a GitHub repository

The person can choose the GitHub way instead: Apervia then builds each push.
Follow [repository.md](repository.md). Ask only when the folder is already
in a GitHub repository. With the GitHub way, `apervia deploy` builds the
connected branch; `--upload` still builds the folder.
