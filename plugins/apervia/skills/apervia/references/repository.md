# Build on each push to GitHub

A build app needs no GitHub: by default the CLI uploads the folder
([upload.md](upload.md)). The GitHub way is an option for a person who
wants Apervia to build the app on each push to GitHub.

Offer it only when the folder is already in a GitHub repository
(`git remote -v` shows a `github.com` address). Then go to "Then" below.

When the folder is not in one, do not offer GitHub, and never ask the
person to make a GitHub account. Only when the person asks for GitHub
themselves, and has an account, help them to make a repository. Use the
first way that works:

1. **The tool's own GitHub sync.** Lovable, Bolt and others can push the
   project to GitHub. Tell the person where to turn it on, and wait. Then
   clone that repository, or add it as `origin` of this folder. The tool then
   pushes each change, and each push builds.
2. **The GitHub CLI.** If `gh auth status` shows a sign-in, ask the person
   for a name, and make a **private** repository (step "Make the first
   commit", then `gh repo create <name> --private --source . --push`).
3. **The browser.** Give the person the steps: on github.com, New
   repository, a name, Private, no README. Then add it as `origin` and push.

## Before the first commit

A first commit with a secret puts the secret in the history for ever. So do
these checks first, and show the person the result:

1. Make sure that `.gitignore` exists and holds at least:

   ```
   .env
   .env.*
   !.env.example
   node_modules/
   dist/
   .apervia/
   ```

2. List what git will commit, and read it:

   ```sh
   git init -b main
   git add --dry-run . | head -200
   ```

   If a file in the list can hold a secret (`.env`, `*.pem`, `*.key`,
   `credentials.json`, a service account file, a SQLite database), add it to
   `.gitignore`, and run the list again.
3. Look for secret values in the files that git will commit. Show the
   person the file and the line, never the value:

   ```sh
   git add -A && git grep -nIE "(sk-[A-Za-z0-9]{20,}|sk_live_|-----BEGIN [A-Z ]*PRIVATE KEY|service_role|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36})" --cached -- . | cut -d: -f1,2
   ```

   If there is one, remove it from the file, keep the value out of the
   transcript, and set it as a secret on Apervia later
   ([configuration.md](configuration.md)).
4. Make the first commit only when both lists are clean:
   `git commit -m "First version"`.

A `.env` file with only public build values (for example the public keys of
a Supabase project) can be committed (AC-BUILD-5). Do not add a new `.env`
file: put new values on Apervia instead.

## Then

Run `! APERVIA_CLIENT=claude-skill apervia github connect` (the person runs
it). The CLI gives Apervia access to the repository on GitHub, in the
browser, and connects it to the environment. The command shows the settings
and the outside hosts that the backend of the repository uses.

Then deploy with `APERVIA_CLIENT=claude-skill apervia deploy --wait --timeout 9m --json`:
it builds the head of the connected branch. A change needs a commit and a
push before the next deploy.

## When a push fails

Read the error. Do not change the git or SSH setup of the computer to make
it work (rule 7 in [SKILL.md](../SKILL.md)).

- `Permission denied (publickey)` or a failed SSH signature: the SSH key does
  not work now. If `gh auth status` shows a sign-in, a push over HTTPS for
  this one command works with no change to the setup:
  `git -c credential.helper='!gh auth git-credential' push https://github.com/<owner>/<repo>.git <branch>`.
  Tell the person that you did this, and why.
- `Authentication failed` over HTTPS: ask the person to run `! gh auth login`.
- `rejected` (non-fast-forward): somebody pushed first. Run `git pull --rebase`,
  show what changed, and push again.
