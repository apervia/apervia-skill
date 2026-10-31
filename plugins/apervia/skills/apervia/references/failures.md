# When a build or a release fails

`apervia deploy --wait` and `apervia release show` give a reason, and the CLI
names the next command. Run that command first. This table says where the
cause usually is.

| Reason | What it means | Look at | Usual fix |
| --- | --- | --- | --- |
| The build failed | The build of the source failed | `apervia build logs` | See "Build" below |
| `image-pull` | The platform cannot get the image | The image name and digest | Check the digest; an administrator adds the registry in the console (AC-BUILD-6) |
| `container-config` | The app cannot be created from its settings | `apervia release show` | A user that is a name, not a number (AC-SEC-1); a missing secret or setting that the release names |
| `container-start` | The program in the image cannot start | `apervia release show` | The start command, or a file that the image does not have |
| `crash-loop` | The app starts and stops again and again | `apervia logs --previous` | Read the last lines: a missing setting, a fixed port, a crash at start |
| `process-exit` | The program ended | `apervia logs --previous` | A web process must keep running |
| `health-check` | The app runs but does not answer on its port | `apervia logs` | Listen on `PORT` and `0.0.0.0` (AC-PROC-1, AC-PROC-2); open the port only when ready (AC-LIFE-1) |
| `timeout` | The app was not ready in time | `apervia logs` | A slow start (AC-LIFE-2); long work before the port opens |
| `outbound-hosts` | The app needs an outside host that is not allowed | `apervia status` | Allow the host ([outbound.md](outbound.md)) |
| `scheduling`, `setup`, or a reason that is not in this table | The platform could not start the app | `apervia release show` | Smaller resources with `apervia scale`, or tell the person to ask an administrator |
| `superseded`, `stopped` | A newer release or a stop replaced it | Nothing | Not a fault |

## Build

Read the end of `apervia build logs`. Common causes:

- No `package.json` at the root, or the project in a subfolder (AC-BUILD-2).
- No `build` script (AC-BUILD-3), or the build script fails: run
  `npm run build` (or the package manager of the project) on the laptop to
  see the same error.
- A lockfile that does not match `package.json`: install again with the
  package manager of the project, and commit the new lockfile.
- No `index.html` in the output folder (AC-BUILD-4): the log names the file.
- A build variable that the build needs is missing. Set it with
  `apervia config set --build`, and deploy again.

## The app runs, but a page is wrong

- A blank page and errors about `undefined` in the browser console: a build
  variable is missing (AC-CFG-1). Set it, and deploy again: a build variable
  needs a new build.
- A page that says the person has no access: the app is private. Only its
  builders can open it ([sharing.md](sharing.md)).
- A call from the server that fails with a proxy error: the host is not
  allowed ([outbound.md](outbound.md)). Show the status line of the error;
  it says why.
- Sign-in through Supabase or another backend returns to the wrong address:
  add the address of the environment to the redirect URLs of the backend.

## Three attempts

After three failed deploys, stop. Tell the person, in plain words:

1. what fails, in one sentence;
2. what you changed, and what each attempt showed;
3. what a developer can look at next, with the command.
