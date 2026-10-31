# Add-ons

An add-on is a service that the platform runs for one environment: a
database, a cache, file storage, email or AI. The platform gives its address
and its password to the app as environment variables. The app never holds a
copy (AC-ADDON-1).

## Choose and attach

1. Run `APERVIA_CLIENT=claude-skill apervia addons catalog --json`. It lists
   the types that this installation offers, their plans and their variables.
   Offer only what it lists.
2. Ask the person, then attach:

   ```sh
   APERVIA_CLIENT=claude-skill apervia addons attach valkey --alias CACHE --json
   ```

   The alias is the prefix of the variables. Choose one that gives the names
   that the app or its framework already reads (AC-ADDON-2). The default is
   the alias of the type.
3. Change the app to read the variables (below), and deploy. The platform
   sets the variables in the next release.
4. Run `APERVIA_CLIENT=claude-skill apervia addons list --json` to see the
   add-ons of the environment.

An app cannot set a name that an add-on gives (AC-CFG-5). Remove such a
setting first.

| Type | Default alias | Variables |
| --- | --- | --- |
| `valkey` (a cache, Redis compatible) | `CACHE` | `CACHE_URL`, `CACHE_HOST`, `CACHE_PORT`, `CACHE_PASSWORD` |
| `postgres` | `DATABASE` | `DATABASE_URL`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_DATABASE` |
| `supabase` | `SUPABASE` | `SUPABASE_URL`, `SUPABASE_INTERNAL_URL`, `SUPABASE_PUBLIC_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_PROJECT_ID`, `SUPABASE_SERVICE_ROLE_KEY` |
| `storage` (S3) | `STORAGE` | `STORAGE_ENDPOINT`, `STORAGE_S3_ENDPOINT`, `STORAGE_BUCKET`, `STORAGE_REGION`, `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY`, `STORAGE_FORCE_PATH_STYLE` |
| `email` | `SMTP` | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_URL`, `SMTP_FROM` |
| `ai` | none | `OPENAI_BASE_URL`, `OPENAI_API_KEY`, `ANTHROPIC_BASE_URL`, `ANTHROPIC_API_KEY` |

The catalog of the installation decides; the table is the usual set.

## Use the variables

These variables reach the server of the app only. The browser code cannot
read them. A static bundle with no server cannot use a cache, a database or
email directly.

- **Cache.** Pass `CACHE_URL` to the client: `new Redis(process.env.CACHE_URL)`
  (ioredis), `createClient({ url: process.env.CACHE_URL })` (node-redis),
  `redis.from_url(os.environ["CACHE_URL"])` (Python).
- **Database.** Pass `DATABASE_URL` to the driver or the ORM (Prisma, Drizzle,
  Django, Rails). Run the migrations in the start command, and keep them
  short (AC-LIFE-2).
- **File storage.** The server signs and uploads with `STORAGE_S3_ENDPOINT`,
  the key pair, `STORAGE_REGION` and path-style requests. A URL for the
  browser uses `STORAGE_ENDPOINT` (AC-ADDON-5). The secret key is never a
  build variable.
- **Email.** Send over SMTP with `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME` and
  `SMTP_PASSWORD`. Do not require TLS or STARTTLS. Send from `SMTP_FROM`
  (AC-ADDON-4). A direct call to an email provider's API is refused
  (AC-NET-4).
- **Supabase.** For the browser, the platform sets the build variables
  `VITE_<ALIAS>_URL`, `VITE_<ALIAS>_PUBLISHABLE_KEY`, `VITE_<ALIAS>_ANON_KEY`
  and `VITE_<ALIAS>_PROJECT_ID` at each build. With the alias `SUPABASE`,
  these are the names that a Lovable app already reads, so the app needs no
  change. Do not set these names yourself. Vite uses them before the values
  of a `.env` file. A server uses `SUPABASE_URL` and the service role key,
  which is never a build variable.

## AI

The AI add-on lets the app call OpenAI and Anthropic models with no key of
its own (AC-ADDON-3, AC-NET-3).

1. Run `APERVIA_CLIENT=claude-skill apervia addons ai --json`. It shows the
   models of the tenant, and the budget. If the tenant has no provider key or
   no budget, an administrator sets them in the console, in AI settings: tell
   the person, and stop.
2. Ask the person which models the app may use, and a monthly budget. Then:
   `APERVIA_CLIENT=claude-skill apervia addons attach ai --models <model>,<model> --budget <dollars> --json`.
   The list and the budget can only narrow what the tenant allows.
3. Remove every provider key, base URL and key setting from the code and the
   settings. The official SDKs read `OPENAI_API_KEY` and `OPENAI_BASE_URL`, or
   the Anthropic pair, with no change.
4. A model that is not on the list is refused, and so is a request after the
   budget is spent. Tell the person that, in plain words.

## Detach and backups

- `apervia addons detach <ALIAS> --confirm <ALIAS>` removes an add-on from the
  environment. Ask first, and say that the app loses the data until an
  administrator restores it.
- `apervia addons backups list|create|restore` manages the backups of a
  database or storage add-on. Ask before a restore: it replaces the data.
