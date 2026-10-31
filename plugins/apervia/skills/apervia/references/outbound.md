# Outside hosts

The server of the app can call an outside HTTPS host only after a builder of
the environment allows it (AC-NET-1). A call from the browser needs nothing
(AC-NET-5).

## Find the hosts

- `APERVIA_CLIENT=claude-skill apervia outbound list --json` shows the
  allowed hosts, and the hosts that the app tried and the platform refused.
- `apervia status` lists the hosts that the app still needs.
- In the code, look at the server code only (route handlers, API routes,
  server actions, a backend). Do not allow a host that only the browser calls.

## Allow a host

Ask the person, and say what the host is for. Then:

```sh
APERVIA_CLIENT=claude-skill apervia outbound allow api.stripe.com --json
```

- Give the exact DNS name. A name with no port allows port 443. Give
  `host:port` for another port.
- An environment allows at most 32 hosts.
- The connection must be TLS to a DNS name: no plain HTTP, no IP address, no
  mail ports (AC-NET-2).
- The app must use an HTTP client that reads `HTTPS_PROXY`. The platform sets
  it, and `NODE_USE_ENV_PROXY=1` for Node.js. Most clients do this already.
  A client that connects in its own way (some database drivers, raw sockets)
  is refused.

## A reserved host

The CLI refuses some hosts, and names the add-on to use instead:

- `api.openai.com`, `api.anthropic.com` and the other model providers: use
  the AI add-on ([addons.md](addons.md)).
- The APIs of the common email providers: use the email add-on.

Tell the person why in one sentence, and make the change to the app.

## When a call still fails

The error that the app gets has a status line that says why, for example
`502 the host did not answer on port 6443`. Show that line. Do not guess.

To stop calls to a host: `apervia outbound remove <host>`. Ask first.
