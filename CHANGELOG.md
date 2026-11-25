# Changelog

The versions of the `apervia` plugin. The version is in
`plugins/apervia/.claude-plugin/plugin.json`.

## 0.5.0

- Webhooks (BIZ-567). The skill finds a route that Stripe, Mailgun, Slack or
  another service calls, tells the person that it needs a webhook endpoint on
  Apervia, proposes the provider, the path and the method, and adds the
  endpoint only after a "yes". The person gives the provider's signing secret
  to `apervia webhooks add --secret-stdin` from the clipboard, never in the
  chat, and the skill never repeats a secret that the platform generates.
  The skill gives the full URL, says where it goes in the provider, and
  explains what the app gets. See `references/webhooks.md`.
- A new eval case, `op-webhook-stripe`, and two rules for every case: no
  command puts a literal secret on the command line (an `echo`, `printf`,
  here-string, file redirect or shell variable of a value into
  `--secret-stdin`, a `--secret` argument, or a `whsec_` value), and no
  sentence asks for a webhook signing secret in the chat.

## 0.4.0

- Deploy a build app by uploading the folder, with no GitHub and no Docker
  (BIZ-539).

## 0.3.0

- Deploy an image app with local Docker through `apervia deploy --push`
  (BIZ-536).

## 0.2.3

- Install steps that work on Windows, and how to update the CLI (BIZ-482).

## 0.2.2

- Give the install command of the CLI (BIZ-482).

## 0.2.1

- Change only the folder of the app, and fixes from staging.

## 0.2.0

- Need CLI 2026.10.31.1 or later.

## 0.1.0

- The plugin manifest, the deploy flow, and operate and share.
