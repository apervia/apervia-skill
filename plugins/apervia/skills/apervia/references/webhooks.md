# Webhooks

A webhook is a request that an outside service, such as Stripe, Mailgun or
Slack, sends to the app. Apervia signs in each person, and a service has no
sign-in. So, on Apervia, a webhook route of the app works only after a
builder adds a **webhook endpoint** for it. Without an endpoint, each
request of the service stops at the Apervia sign-in, and the app never sees
it. The provider shows the failures, and the app log shows nothing.

A webhook endpoint is one exact path of one environment. The platform checks
each request with a secret before it sends the request to the app.

The commands are `apervia webhooks presets`, `list`, `add`, `rotate` and
`remove`. Run `APERVIA_CLIENT=claude-skill apervia webhooks --help`. If the
command does not exist, ask the person to run `! apervia cli update`, and
try again. If it still does not exist, tell the person that their CLI cannot
add a webhook endpoint yet, and give them the docs:
<https://docs.apervia.ai/docs/services/webhooks>.

## The rules for secrets

These rules add to rule 1 of [SKILL.md](../SKILL.md).

- **Never ask for a webhook secret in the chat.** A signing secret (for
  example a Stripe `whsec_…` value) goes from the provider's dashboard
  straight into the CLI, on the person's computer.
- **Never put a secret in a command line.** No `echo` or `printf` of a
  value, no `--secret` argument. The CLI reads a signing secret only from a
  pipe, with `--secret-stdin`.
- **Never repeat a generated secret.** For some methods the platform makes
  the secret, and the CLI prints it one time. Ask the person to run that
  command in their own terminal window, so that the secret stays out of this
  conversation. If a generated secret still reaches the conversation, do
  not write it again in a message, a file or a command. Tell the person to
  store it from the output of the CLI.
- **Never run `webhooks add` or `webhooks rotate` with a secret yourself.**
  The person runs it.

## 1. Find the webhook routes

Look for a webhook route in the server code. A route that only the browser
calls is not a webhook. Signs of a webhook route:

- A path such as `/api/webhooks/stripe`, `/api/stripe/webhook`,
  `/api/inbound-email`, `/api/mailgun/inbound`, `/api/slack/events`,
  `/api/twilio/sms` or `/api/github/webhook`.
- A call that checks the signature of a provider:
  `stripe.webhooks.constructEvent`, `@slack/bolt`, `twilio.validateRequest`,
  `@octokit/webhooks`, `svix` or `standardwebhooks`, a check of the Mailgun
  `signature.token`, or a header such as `Stripe-Signature`,
  `X-Slack-Signature`, `X-Twilio-Signature`, `X-Hub-Signature-256`,
  `X-Shopify-Hmac-Sha256` or `X-HubSpot-Signature-v3`.

This search prints file names only:

```sh
grep -rlE "webhooks?\b|inbound-email|constructEvent|@slack/bolt|validateRequest|@octokit/webhooks|svix|standardwebhooks|Stripe-Signature|X-Slack-Signature|X-Twilio-Signature|X-Hub-Signature|X-Shopify-Hmac|X-HubSpot-Signature" --include=*.{js,jsx,ts,tsx,mjs,cjs,py,go,rb,php} . 2>/dev/null | grep -v node_modules
```

Then read each file, and find the exact path and the HTTP method of the
route. In a Next.js app, `app/api/webhooks/stripe/route.ts` with a `POST`
function is `POST /api/webhooks/stripe`.

A webhook that a backend outside Apervia receives needs no endpoint. For
example, a Supabase Edge function of a Lovable app runs at Supabase, and a
base44 backend stays with base44.

When you find a webhook route, tell the person in plain words, for example:
"Your app receives Stripe events at /api/webhooks/stripe. On Apervia, Stripe
cannot reach that address until we add a webhook endpoint for it. I can set
that up after the app is live." Add the endpoint only after the first
release, because the environment needs its address first.

Run `APERVIA_CLIENT=claude-skill apervia webhooks list --json` to see the
endpoints that the environment already has. Do not add one twice.

## 2. Propose the endpoint, then ask

Run `APERVIA_CLIENT=claude-skill apervia webhooks presets --json`. It lists
the providers that Apervia knows, and the methods of each.

Propose one endpoint for each route, and say what each part is:

- **The name**: short, with lower-case letters and hyphens, for example
  `stripe-events`.
- **The provider**: the preset of the provider (for example `stripe`,
  `mailgun`, `slack`). With a preset, the platform checks the provider's
  signature with the provider's signing secret.
- **The path**: the exact path of the route, for example
  `/api/webhooks/stripe`. The path starts with `/`, has no `/` at the end,
  has only letters, digits, `-`, `.`, `_` and `~`, and does not start with
  `/_apervia/` or `/supabase/`. A route with a variable part (for example
  `/api/webhooks/[provider]`) needs one endpoint for each real path.
- **The method**: `POST` unless the route takes another one.

Then ask: "Shall I set this up?" Go on only after a "yes".

When the provider has no preset, use `--provider custom` with a secret that
the platform makes:

- `--method-type header_secret:<header>` when the provider can send a fixed
  header;
- `--method-type query_secret:<parameter>` when it can only call a URL;
- `--method-type unique_path` when it can only call a URL and the query is
  not kept. The secret is then the whole path.

Choose the method from what the provider can send, and say why.

## 3. Add the endpoint

First run `APERVIA_CLIENT=claude-skill apervia status --json`, and build the
full URL: `https://` + the host of the environment + the path. For example
`https://orders.acme.apervia.example.com/api/webhooks/stripe`.

### With the provider's signature

The provider makes the signing secret, often only after the URL is in the
provider's dashboard. So:

1. Give the person the full URL, and say where it goes in the provider. For
   Stripe: Dashboard, Developers, Webhooks, "Add endpoint", the endpoint
   URL, and the events that the app handles. For Mailgun: Sending, Webhooks,
   or Receiving, Routes, with the URL. For Slack: the app's "Event
   Subscriptions" Request URL.
2. Ask the person to copy the signing secret in the provider's dashboard
   (for Stripe: "Signing secret", `whsec_…`). Do not ask them to paste it
   here.
3. Give the person the one line to run with the `!` prefix. It reads the
   secret from the clipboard, so the secret is never on the command line and
   never in this conversation:

   - macOS:

     `! pbpaste | APERVIA_CLIENT=claude-skill apervia webhooks add stripe-events --provider stripe --path /api/webhooks/stripe --secret-stdin`
   - Linux: the same, with `wl-paste -n` (Wayland) or
     `xclip -selection clipboard -o` (X11) in place of `pbpaste`.
   - Windows (Git Bash): the same, with `cat /dev/clipboard` in place of
     `pbpaste`.

   If the person prefers to type the secret, they run this in their own
   terminal window, not with the `!` prefix. It asks for the secret and
   does not show it:

   `read -rs S && printf %s "$S" | APERVIA_CLIENT=claude-skill apervia webhooks add stripe-events --provider stripe --path /api/webhooks/stripe --secret-stdin; unset S`
4. Wait for the person to say that it is done. Then run
   `APERVIA_CLIENT=claude-skill apervia webhooks list --json` to check that
   the endpoint is there.

### With a secret that the platform makes

The CLI prints the secret one time. Ask the person to run the command in
their own terminal window, not with the `!` prefix, and to store the secret
that it prints. For example:

`APERVIA_CLIENT=claude-skill apervia webhooks add build-hook --provider custom --path /api/hooks/build --method-type header_secret:X-Webhook-Token`

Then tell them where to put the secret in the provider (the header value,
or the URL with the query parameter). For a unique path, the URL is the
host and the unique path that the CLI printed: do not build or show it
yourself. Then check with `apervia webhooks list --json`, which never shows
a secret.

### Then

- A new endpoint is ready in about a minute.
- Ask the person to send a test event from the provider (Stripe: "Send test
  webhook"). Read the result with `APERVIA_CLIENT=claude-skill apervia logs --tail 100`.
  A request that the platform refused never reaches the app, so the app log
  shows nothing for it: the provider's dashboard shows the status.
- Give the link to the docs, with a section for each provider:
  <https://docs.apervia.ai/docs/services/webhooks>.

## What the app gets

Tell the person this when they ask, or when the app must change:

- The platform checks the request first. Only a request that passes reaches
  the app.
- The app gets the provider's headers and body unchanged, so the app can
  still check the signature itself. An app that checks the signature keeps
  working: it reads the same signing secret as a secret of the environment,
  for example `STRIPE_WEBHOOK_SECRET`. Set it as in
  [configuration.md](configuration.md), with the same value.
- The app also gets the header `X-Apervia-Webhook`, with the name of the
  endpoint.
- The request has no user: no `X-Apervia-User` and no sign-in. Code on a
  webhook route must not need a signed-in person. Code that reads the user on
  every path must let the webhook route through.
- The match is exact: `/api/webhooks/stripe/` or
  `/api/webhooks/stripe/extra` still needs a sign-in.

## Sleep

A webhook wakes an environment that is asleep. The first request after a
sleep can be slow while the app starts. Most providers send a failed event
again, so the app still gets it. Some wait only a few seconds (Slack waits
3). If the provider does not send an event again and the app must never
miss one, tell the person that the environment can stay awake:
`apervia sleep policy --mode off`. Ask first, and say that an awake
environment costs more.

## Change, rotate or remove

- **Rotate a provider's secret.** The person rolls the secret at the
  provider, copies the new one, and runs, with the `!` prefix:
  `! pbpaste | APERVIA_CLIENT=claude-skill apervia webhooks rotate stripe-events --secret-stdin`.
  The previous secret stays valid for 24 hours (`--keep-previous`).
- **Rotate a generated secret.** The person runs
  `APERVIA_CLIENT=claude-skill apervia webhooks rotate <name>` in their own
  terminal window, because the CLI prints the new secret.
- **Remove an endpoint.** Ask first, and say that the provider's next request
  fails. On a "yes", run
  `APERVIA_CLIENT=claude-skill apervia webhooks remove <name> --yes --json`.
