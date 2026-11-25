# Apervia for Claude Code

A Claude Code plugin with one skill, `apervia`. Open Claude Code in the
folder of an app and say "put this on Apervia". The skill:

1. finds what kind of app it is, from its files;
2. changes the app so that it runs on Apervia, and shows each change;
3. sends the folder to Apervia, which builds it, after it shows you the
   list of files and checks that no secret is in it, or, for a server,
   builds it into an image with Docker on your computer;
4. creates the app, deploys it, and reads the logs when a step fails;
5. gives you the address of the app.

After the first release, it sets settings and secrets, adds a database, a
cache, file storage, email or AI, allows outside hosts, sets up a webhook
endpoint for Stripe, Mailgun, Slack or another service, imports the data of
a Lovable app, and shares the app with your team.

The skill does all of this with the `apervia` CLI. It never sees your
password or a secret value: you type each secret into the CLI yourself, and
a webhook signing secret goes from your clipboard to the CLI.

[CHANGELOG.md](CHANGELOG.md) lists the changes of each version.

## What you need

- [Claude Code](https://claude.com/claude-code).
- The `apervia` CLI, version 2026.11.23.1 or later, signed in to your
  tenant. Run `apervia cli update` to get the newest version. To install it:
  - macOS or Linux: `curl -fsSL https://downloads.apervia.ai/cli/install.sh | sh`
  - Windows, in PowerShell: `irm https://downloads.apervia.ai/cli/install.ps1 | iex`
- To set up a webhook endpoint: a CLI with the `apervia webhooks` command.
- For an app that Apervia builds from source (a Vite, Next.js or other
  static or Node.js web app): nothing more. You need no GitHub account and no
  Docker. The CLI never sends a `.env` file. If the folder is already in a
  GitHub repository, you can choose to have Apervia build each push instead.
- For an app that runs as an image (a server such as Express, or a project
  with its own `Dockerfile`): [Docker](https://docs.docker.com/get-docker/)
  on your computer, with its `docker` command. Colima works with the
  `docker` command installed. Podman works only with its `docker`-compatible
  command (`podman-docker`). The CLI builds the image for
  `linux/amd64` and sends it to Apervia. You need no registry and no
  registry sign-in.

## Install

In Claude Code:

```
/plugin marketplace add apervia/apervia-skill
/plugin install apervia@apervia
```

Claude Code does not update this marketplace by itself. To get a new version
of the skill, run `/plugin marketplace update apervia`. To get each new
version with no command, open `/plugin`, choose the `apervia` marketplace and
turn on auto-update.

## Use

In the folder of an app:

```
/apervia:apervia put this app on Apervia
```

Or say what you want, for example "deploy this to Apervia", "why did the
release fail?", "add a cache", "Stripe webhooks fail", "let the finance team use it".

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
