# When a build or a release fails

`apervia deploy --wait` and `apervia release show` give a reason, and the CLI
names the next command. Run that command first. This table says where the
cause usually is.

| Reason | What it means | Look at | Usual fix |
| --- | --- | --- | --- |
| The build failed | The build of the source failed | `apervia build logs` | See "Build" below |
| `image-pull` | The platform cannot get the image | The image name and digest | Deploy again with `apervia deploy --push`. For an image that the developer published, check the digest; an administrator adds that registry in the console (AC-BUILD-6) |
| `container-config` | The app cannot be created from its settings | `apervia release show` | A user that is a name, not a number (AC-SEC-1); a missing secret or setting that the release names |
| `container-start` | The program in the image cannot start | `apervia release show` | The start command, or a file that the image does not have |
| `crash-loop` | The app starts and stops again and again | `apervia logs --previous` | Read the last lines: a missing setting, a fixed port, a crash at start |
| `process-exit` | The program ended | `apervia logs --previous` | A web process must keep running |
| `health-check` | The app runs but does not answer on its port | `apervia logs` | Listen on `PORT` and `0.0.0.0` (AC-PROC-1, AC-PROC-2); open the port only when ready (AC-LIFE-1) |
| `timeout` | The app was not ready in time | `apervia logs` | A slow start (AC-LIFE-2); long work before the port opens |
| `outbound-hosts` | The app needs an outside host that is not allowed | `apervia status` | Allow the host ([outbound.md](outbound.md)) |
| `scheduling`, `setup`, or a reason that is not in this table | The platform could not start the app | `apervia release show` | Smaller resources with `apervia scale`, or tell the person to ask an administrator |
| `superseded`, `stopped` | A newer release or a stop replaced it | Nothing | Not a fault |

## When the push fails

`apervia deploy --push` builds the image on the person's computer and sends
it to Apervia before the release. When that fails, nothing was released, and
the app keeps its last release. The JSON error has a `code`:

| `code` | What it means | What to tell the person, and do |
| --- | --- | --- |
| `push_over_quota` | The tenant has no more room for images | Apervia has no room for the app right now. An administrator of the tenant deletes images or data that the tenant no longer needs, or asks the operator of the platform for more room. Do not deploy again until they say it is done |
| `push_refused` | Apervia refused the image. Usually Apervia is cleaning up old images, and it takes no image while it does | Apervia is busy for a few minutes. Wait some minutes, and deploy again once. If it is refused again, the person may not be allowed to release this environment, or the tenant has no more room: say so, and stop |
| `registry_unavailable` | Apervia cannot take the image now | Wait some minutes, and deploy again once |
| `image_not_amd64` | The image is not for `linux/amd64`, the only architecture that Apervia runs | Deploy with `apervia deploy --push` and no image name, so that the CLI builds the `Dockerfile` for `linux/amd64`. If the `Dockerfile` names another platform (`FROM --platform=...`), remove that. If the build then fails, read `local_build_failed` |
| `local_build_failed` | Docker could not build the `Dockerfile` | Read the output of Docker above the error, fix the `Dockerfile` or the app, and deploy again. If Docker itself fails, run `apervia doctor --json` and give the person `docker.reason` |
| `no_local_image` | There is no `Dockerfile` in the folder, or no image of that name | Write the `Dockerfile` ([classes/image.md](classes/image.md)), or run the command in the folder of the app |
| `push_failed` | The image did not reach Apervia, for example a network fault | Deploy again once. If it fails again, tell the person what the error says |

Never answer a push failure with `docker login`, `docker push`, or a
question about a registry or its password: the CLI needs none of them.

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
