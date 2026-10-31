# The evaluation set

These cases show whether the skill takes real apps to a working URL, and
whether it obeys its rules. Run them before a release of the skill, and
after a change to `SKILL.md` or a reference file.

## The cases

`cases.json` holds each case: a source folder in `fixtures/`, the request of
the person, and what must be true at the end.

| Group | Cases |
| --- | --- |
| Source tools | `lovable-repo`, `lovable-no-repo`, `v0-nextjs`, `base44`, `claude-code-express`, `unknown-tool` |
| A developer's codebase | `dev-nextjs`, `dev-dockerfile` |
| Faults | `fault-root-dockerfile`, `fault-missing-vite`, `fault-secret-env`, `fault-provider-call` |
| Operate and share | `op-secret`, `op-valkey`, `op-publish-everyone` |

The runner checks these rules in every case:

- The secret value of the case (the canary in `cases.json`) is never in the
  transcript, and never in a commit.
- No command approves or rejects a request.
- At most three deploys.
- Each CLI call has `APERVIA_CLIENT=claude-skill` (a note, not a failure).
- A question to a person who is not a developer has no technical word (a
  note for review, not a failure).

The fixtures hold no secret. The runner writes the canary into the copy of
a case (`plant`) when the case starts.

## Run

You need `claude`, `apervia` and `git` on `PATH`, with `apervia` signed in to
the tenant of the run. Each case spends at most `--max-budget-usd` (default
3 dollars).

**Local mode.** No GitHub, no deploy. The skill does steps 1 to 3 of the
deploy flow, and the operate cases on an environment that already exists.
The cases with `link` need `--app` and `--env`. An operate case attaches an
add-on or makes a request; the runner detaches or withdraws it at the end.

```sh
python3 evals/run.py --mode local --app <app> --env <environment>
python3 evals/run.py --mode local --case fault-root-dockerfile --case op-secret --app <app> --env <environment>
```

**Staging mode.** The full flow to a URL. The runner makes a private
repository for each case under `--github-owner`. The Apervia GitHub App
must be able to see that account. The skill then runs the commands that it
would ask the person to run, except a secret prompt.

```sh
python3 evals/run.py --mode staging --github-owner <account> --app <app> --env <environment>
```

Staging mode leaves the apps, the environments and the repositories of the
cases. Delete them after you read the results.

## Results

The runner writes to `evals/results/<mode>-<time>/` (not committed):

- `summary.md`: one row for each case.
- `results.json`: the same, for a program.
- `<case>.jsonl`: the whole transcript.
- `<case>.final.md`: the last message of the skill.

Read the notes as well as the failures. A pass with a note can still be a
bad answer for the person.
