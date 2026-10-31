# Settings and secrets

Each environment has its own settings. There are three kinds (AC-CFG-1 to
AC-CFG-3):

| Kind | Use it for | Command |
| --- | --- | --- |
| Build variable | A value that the browser code reads: `VITE_*`, `NEXT_PUBLIC_*`, `REACT_APP_*` | `apervia config set --build NAME=value` |
| Runtime setting | A value that the server reads, and that is not secret | `apervia config set NAME=value` |
| Secret | A password, a private API key, a token | The person types it: see below |

- A build variable goes into the build, and the browser shows it to every
  visitor. It is **never** a secret (AC-CFG-2). A change needs a new build:
  run `apervia deploy --wait` after it.
- A runtime setting or a secret takes effect at once: the CLI makes a new
  release.
- Do not set `PORT`, a name that starts with `APERVIA_`, or a name that an
  add-on gives (AC-CFG-4, AC-CFG-5).

## Find the names that the app reads

```sh
grep -rhoE "(import\.meta\.env|process\.env)\.[A-Z][A-Z0-9_]*" --include=*.{js,jsx,ts,tsx,mjs,cjs,vue,svelte} . 2>/dev/null | grep -v node_modules | sort -u
```

For other languages, look for `os.environ`, `os.Getenv`, `ENV[` and the
like. A `.env.example` file often lists the names. Read the names only. Do
not print the values of a `.env` file.

Then compare with what the environment has:

```sh
APERVIA_CLIENT=claude-skill apervia config get --json
APERVIA_CLIENT=claude-skill apervia secrets list --json
APERVIA_CLIENT=claude-skill apervia status --json
```

`status` also lists what the app still needs.

## Is it a secret?

Treat a value as a secret when in doubt. These are secrets: a database
password or URL with a password, a private API key (Stripe `sk_…`, an
OpenAI key), a service role key, a webhook signing secret, a private key, an
OAuth client secret, a session secret.

These are not secrets: a public URL, a feature switch, a log level, a key
that the provider calls public or publishable (a Supabase anon or
publishable key, a Stripe `pk_…` key).

A secret that the browser code needs is a fault in the app: the browser
shows it to every visitor. Move that call to a server, or tell the person.

## Set a secret

**Never** put the value of a secret in a command, a file or a message.
Never ask the person to paste it into the chat.

1. Tell the person which secret is needed and where they can find the value
   (for example "the secret key in the Stripe dashboard, Developers, API
   keys").
2. Ask the person to run, with the `!` prefix:

   `! APERVIA_CLIENT=claude-skill apervia secrets set STRIPE_SECRET_KEY`

   The CLI asks for the value with a hidden prompt.
3. Run `APERVIA_CLIENT=claude-skill apervia secrets list --json` to check
   that the name is there. The CLI never shows the value.

If the value is in a file that the person already has (for example a JSON
key of a service account), the person can run
`! APERVIA_CLIENT=claude-skill apervia secrets set NAME --from-file <path>`.
Do not read the file.

If a secret is in the repository or in a file that git tracks, it is
already exposed: tell the person to rotate it at the provider, and set the
new value as above (AC-BUILD-5).

## Change or remove

- `apervia config unset NAME` and `apervia secrets unset NAME` remove a
  value. Ask first.
- `apervia secrets rename OLD NEW` keeps the value under a new name.
- `apervia config history` lists the versions of the settings.
