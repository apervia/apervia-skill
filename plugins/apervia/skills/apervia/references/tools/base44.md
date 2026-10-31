# base44

A base44 app is a React frontend
([../classes/static-bundle.md](../classes/static-bundle.md)) that calls the
cloud of base44 from the browser, with `@base44/sdk`.

- The backend stays with base44 (AC-CLASS-5). The data, the sign-in and the
  functions of the app stay there. Apervia hosts the frontend only. Tell the
  person this in one sentence before the deploy.
- The app ID and the settings of the SDK are public values. When the code
  reads them from `import.meta.env`, they are build variables.
- The app can still ask the person to sign in to base44. That is the account
  of base44, separate from the sign-in of Apervia (AC-ID-4).
- Add the address of the environment to the allowed domains of the app in
  base44, if base44 asks for it.
