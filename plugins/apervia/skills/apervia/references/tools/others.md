# Other tools

## Bolt

A Bolt app is usually a Vite static bundle, sometimes with Supabase. Treat it
like [../classes/static-bundle.md](../classes/static-bundle.md). Bolt can
connect a project to GitHub; use that repository when the person has it.

## Replit

- A `.replit` file names the run command. The platform does not read it.
- An Express or Python server is an image app
  ([../classes/image.md](../classes/image.md)). A Vite frontend is a static
  bundle.
- Replit secrets do not come with the code. Ask the person which values the
  app needs, and set them on Apervia
  ([../configuration.md](../configuration.md)).
- Replit Database and Replit Object Storage do not exist on Apervia. Use an
  add-on ([../addons.md](../addons.md)).
- A fixed port such as `3000`, or a listen on `localhost`: change it to read
  `PORT` and listen on `0.0.0.0` (AC-PROC-1, AC-PROC-2).

## Claude Code, Cursor and others

There is no common shape. Run `apervia check`, read the class file, and
follow it. Look for a server that the person does not know about, a `.env`
file with real secrets, and a port in the code.
