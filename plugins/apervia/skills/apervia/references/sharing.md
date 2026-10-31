# Share an app

A new app is **private**: only its builders can open it. The person who made
it is its owner, and always a builder.

| The person wants | Command | Needs approval |
| --- | --- | --- |
| A team to use the app | `apervia share publish <team>` | Yes |
| Every person of the tenant to use it | `apervia share publish everyone --confirm everyone` | Yes, also an administrator |
| A person to help build it | `apervia share builders add <email>` | Yes |
| A team to stop using it | `apervia share unpublish <team>` | No, at once |
| Nobody else to use it | `apervia share private --confirm <app>` | No, at once |
| A person to stop building it | `apervia share builders remove <email>` | No, at once |
| To see who has it | `apervia share list` | No |

Put `APERVIA_CLIENT=claude-skill` in front of each command, and add `--json`
when you read the output.

## Approval

A publish and a new builder are **requests**. An approver decides each one in
the console. The CLI never approves, also when the person is an approver or
an administrator. This is on purpose: a program cannot widen access with no
person who decides.

1. Ask the person before each request. Say who will get access, and to
   which environment (a team reaches the live environment only).
2. For `everyone`, ask again, and say that every person of the tenant can
   then open the app.
3. After the command, give the person the console link that it prints, and
   say that the change waits for an approver.
4. Never ask anybody to approve, and never say that you will approve. Never
   try to approve in another way.
5. `apervia requests list --json` shows the person's requests. `apervia
   requests show <id>` shows who can approve. `apervia requests withdraw <id>`
   cancels the person's own pending request: ask first.

## App permissions

An app can let some people do more than others, for example approve an
invoice. The app reads the permissions of the person from the header
`X-Apervia-App-Permissions` (AC-ID-3). A permission gives no access to the
app: only people who can already open the app get it.

```sh
apervia share permissions list
apervia share permissions create approve --description "Approve an invoice" --team finance
apervia share permissions grant approve --person ana@example.com
apervia share permissions revoke approve --team finance
apervia share permissions delete approve --confirm approve
```

These need no approval. Ask before each change. When you add a permission,
also change the app to check the header for it, and test it with
`apervia emulator start --target <port>`.
