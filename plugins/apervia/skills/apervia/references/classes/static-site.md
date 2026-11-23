# A static site with no package.json

`class.id`: `static-site`. Source: **build**.

The folder has `index.html` and no `package.json`. A build from source needs
a `package.json` at the root (AC-BUILD-2).

Make the site a Vite project. Vite builds `index.html`, and the files that it
links to, into `dist`. Put files that the HTML does not link to (for example
`robots.txt`) in a folder `public/`.

1. Ask the person, then add this `package.json`, and show it:

   ```json
   {
     "name": "site",
     "private": true,
     "type": "module",
     "scripts": {
       "build": "vite build"
     },
     "devDependencies": {
       "vite": "^6"
     }
   }
   ```

2. Run `npm install` to make `package-lock.json`. With the GitHub way,
   commit both files (AC-BUILD-2). With the upload, make no git repository.
3. Run `npm run build`, and check that `dist/index.html` exists.

Then run `apervia check` again. It must report `static-bundle`. Continue with
[static-bundle.md](static-bundle.md).
