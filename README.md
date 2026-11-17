# Apervia for Claude Code

A Claude Code plugin with one skill, `apervia`. Open Claude Code in the
folder of an app and say "put this on Apervia". The skill:

1. finds what kind of app it is, from its files;
2. changes the app so that it runs on Apervia, and shows each change;
3. puts the folder in a GitHub repository, if it is not in one;
4. creates the app, deploys it, and reads the logs when a step fails;
5. gives you the address of the app.

After the first release, it sets settings and secrets, adds a database, a
cache, file storage, email or AI, allows outside hosts, imports the data of a
Lovable app, and shares the app with your team.

The skill does all of this with the `apervia` CLI. It never sees your
password or a secret value: you type each secret into the CLI yourself.

## What you need

- [Claude Code](https://claude.com/claude-code).
- The `apervia` CLI, version 2026.10.31.1 or later, signed in to your
  tenant. Run `apervia cli update` to get the newest version.
- For an app that Apervia builds from source: a GitHub account.

## Install

In Claude Code:

```
/plugin marketplace add apervia/apervia-skill
/plugin install apervia@apervia
```

To get a new version of the skill: `/plugin marketplace update apervia`.

## Use

In the folder of an app:

```
/apervia:apervia put this app on Apervia
```

Or say what you want, for example "deploy this to Apervia", "why did the
release fail?", "add a cache", "let the finance team use it".

The skill asks before each change that deletes something, publishes the app
or adds a builder. A publish or a new builder waits for an approver in the
Apervia console. The skill cannot approve it.

## Work on the skill

```sh
claude --plugin-dir plugins/apervia      # try the skill from this checkout
python3 scripts/check-links.py           # every link resolves
claude plugin validate .                 # the marketplace
claude plugin validate plugins/apervia   # the plugin
```

The files of the plugin run on the computers of the people who use Apervia.
They say what an app must do, never how the platform works inside.

The rules of the app contract come from the CLI: `apervia check --rules`
lists them. `references/contract.md` explains them in plain words, by
identifier.

## License

MIT. See [LICENSE](LICENSE).
