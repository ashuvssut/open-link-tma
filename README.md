# 🧭 open-link-tma

A **Telegram Mini App (TMA)** that allows you to open external links directly from within Telegram.

A TMA is a web application that is registered with a Telegram Bot. It can be launched from the Bot's chat only.

### 🚩 How to Launch the TMA

This app runs inside a **WebView** in the Telegram app and can be launched in **two ways**:


#### 🧩 1. Using `web_app` Keyboard Button

Attach a `web_app`-type KeyboardButton to a bot message.
- This is the _**recommended**_ way to launch TMAs. It will enable you to use [`sendData`](https://docs.telegram-mini-apps.com/packages/tma-js-sdk/features/uncategorized#senddata) to send data strings back to the bot to which your bot can listen and respond with service messages.
- Reference: [KeyboardButton Mini Apps](https://core.telegram.org/bots/webapps#keyboard-button-mini-apps)
- The `web_app` URL should point to the deployed app, e.g.

  ```
  https://ashuvssut.github.io/open-link-tma/#?open=${encodeURIComponent('https://example.com?token=mock-token&lang=en')}
  ```
- **Note:** The `#` prefix is required because the app uses React Router’s `HashRouter`.

---

#### 🚀 2. Using `t.me` Link with `startapp` Parameter

You can also launch the app via a `t.me` link containing a Base62-encoded start parameter.

- Reference: [Start Parameter Docs](https://docs.telegram-mini-apps.com/platform/start-parameter)
- Example:

  ```
  https://t.me/OpenLinkTMA_bot/OpenLinkTMA?startapp=${encodeBase62('https://example.com?token=mock-token&lang=en')}
  ```
- The encoded value will be decoded and opened automatically within the app.

---

### 🧠 Development Notes

- The mock Base62-encoded link is logged in [`src/mockEnv.ts`](./src/mockEnv.ts).
- Base62 encoding/decoding utilities are implemented in [`src/utils.ts`](./src/utils.ts).
- I have also left some helpful notes about variables in the code comments in [`src/constants.ts`](./src/constants.ts).
- The TMA cannot open links without user interaction due to webview security restrictions.
  - See comments in [`src/pages/OpenLinkPage/AutoOpenLink.tsx`](./src/pages/OpenLinkPage/AutoOpenLink.tsx) for details.
- This TMA uses Telegram UI components. Checkout the [Storybook](https://tgui.xelene.me/?path=/docs/getting-started--documentation)


### 🚫 Limitations
- This TMA only works in android as of now. iOS support is coming soon.

-------------

# This project was created from Telegram Mini Apps React Template

This template demonstrates how developers can implement a single-page
application on the Telegram Mini Apps platform using the following technologies
and libraries:

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [TON Connect](https://docs.ton.org/develop/dapps/ton-connect/overview)
- [@tma.js SDK](https://docs.telegram-mini-apps.com/packages/tma-js-sdk)
- [Telegram UI](https://github.com/Telegram-Mini-Apps/TelegramUI)
- [Vite](https://vitejs.dev/)

> The template was created using [npm](https://www.npmjs.com/). Therefore, it is
> required to use it for this project as well. Using other package managers, you
> will receive a corresponding error.

## Install Dependencies

If you have just cloned this template, you should install the project
dependencies using the command:

```Bash
npm install
```

## Scripts

This project contains the following scripts:

- `dev`. Runs the application in development mode.
- `dev:https`. Runs the application in development mode using locally created valid SSL-certificates.
- `build`. Builds the application for production.
- `lint`. Runs [eslint](https://eslint.org/) to ensure the code quality meets
  the required standards.
- `deploy`. Deploys the application to GitHub Pages.

To run a script, use the `npm run` command:

```Bash
npm run {script}
# Example: npm run build
```

## Create Bot and Mini App

Before you start, make sure you have already created a Telegram Bot. Here is
a [comprehensive guide](https://docs.telegram-mini-apps.com/platform/creating-new-app)
on how to do it.

## Run

Although Mini Apps are designed to be opened
within [Telegram applications](https://docs.telegram-mini-apps.com/platform/about#supported-applications),
you can still develop and test them outside of Telegram during the development
process.

To run the application in the development mode, use the `dev` script:

```bash
npm run dev:https
```

> [!NOTE]
> As long as we use [vite-plugin-mkcert](https://www.npmjs.com/package/vite-plugin-mkcert),
> launching the dev mode for the first time, you may see sudo password request.
> The plugin requires it to properly configure SSL-certificates. To disable the plugin, use the `npm run dev` command.

After this, you will see a similar message in your terminal:

```bash
VITE v5.2.12  ready in 237 ms

➜  Local:   https://localhost:5173/reactjs-template
➜  Network: https://172.18.16.1:5173/reactjs-template
➜  Network: https://172.19.32.1:5173/reactjs-template
➜  Network: https://192.168.0.171:5173/reactjs-template
➜  press h + enter to show help
```

Here, you can see the `Local` link, available locally, and `Network` links
accessible to all devices in the same network with the current device.

To view the application, you need to open the `Local`
link (`https://localhost:5173/reactjs-template` in this example) in your
browser:

![Application](assets/application.png)

It is important to note that some libraries in this template, such as
`@tma.js/sdk`, are not intended for use outside of Telegram.

Nevertheless, they appear to function properly. This is because the
`src/mockEnv.ts` file, which is imported in the application's entry point (
`src/index.ts`), employs the `mockTelegramEnv` function to simulate the Telegram
environment. This trick convinces the application that it is running in a
Telegram-based environment. Therefore, be cautious not to use this function in
production mode unless you fully understand its implications.

> [!WARNING]
> Because we are using self-signed SSL certificates, the Android and iOS
> Telegram applications will not be able to display the application. These
> operating systems enforce stricter security measures, preventing the Mini App
> from loading. To address this issue, refer to
> [this guide](https://docs.telegram-mini-apps.com/platform/getting-app-link#remote).

## Deploy

This boilerplate uses GitHub Pages as the way to host the application
externally. GitHub Pages provides a CDN which will let your users receive the
application rapidly. Alternatively, you could use such services
as [Heroku](https://www.heroku.com/) or [Vercel](https://vercel.com).

### Manual Deployment

This boilerplate uses the [gh-pages](https://www.npmjs.com/package/gh-pages)
tool, which allows deploying your application right from your PC.

#### Configuring

Before running the deployment process, ensure that you have done the following:

1. Replaced the `homepage` value in `package.json`. The GitHub Pages deploy tool
   uses this value to
   determine the related GitHub project.
2. Replaced the `base` value in `vite.config.ts` and have set it to the name of
   your GitHub
   repository. Vite will use this value when creating paths to static assets.

For instance, if your GitHub username is `telegram-mini-apps` and the repository
name is `is-awesome`, the value in the `homepage` field should be the following:

```json
{
  "homepage": "https://telegram-mini-apps.github.io/is-awesome"
}
```

And `vite.config.ts` should have this content:

```ts
export default defineConfig({
  base: '/is-awesome/',
  // ...
});
```

You can find more information on configuring the deployment in the `gh-pages`
[docs](https://github.com/tschaub/gh-pages?tab=readme-ov-file#github-pages-project-sites).

#### Before Deploying

Before deploying the application, make sure that you've built it and going to
deploy the fresh static files:

```bash
npm run build
```

Then, run the deployment process, using the `deploy` script:

```Bash
npm run deploy
```

After the deployment completed successfully, visit the page with data according
to your username and repository name. Here is the page link example using the
data mentioned above:
https://telegram-mini-apps.github.io/is-awesome

### GitHub Workflow

To simplify the deployment process, this template includes a
pre-configured [GitHub workflow](.github/workflows/github-pages-deploy.yml) that
automatically deploys the project when changes are pushed to the `master`
branch.

To enable this workflow, create a new environment (or edit the existing one) in
the GitHub repository settings and name it `github-pages`. Then, add the
`master` branch to the list of deployment branches.

You can find the environment settings using this
URL: `https://github.com/{username}/{repository}/settings/environments`.

![img.png](.github/deployment-branches.png)

In case, you don't want to do it automatically, or you don't use GitHub as the
project codebase, remove the `.github` directory.

### GitHub Web Interface

Alternatively, developers can configure automatic deployment using the GitHub
web interface. To do this, follow the link:
`https://github.com/{username}/{repository}/settings/pages`.

## TON Connect

This boilerplate utilizes
the [TON Connect](https://docs.ton.org/develop/dapps/ton-connect/overview)
project to demonstrate how developers can integrate functionality related to TON
cryptocurrency.

The TON Connect manifest used in this boilerplate is stored in the `public`
folder, where all publicly accessible static files are located. Remember
to [configure](https://docs.ton.org/develop/dapps/ton-connect/manifest) this
file according to your project's information.

## Useful Links

- [Platform documentation](https://docs.telegram-mini-apps.com/)
- [@tma.js/sdk-react documentation](https://docs.telegram-mini-apps.com/packages/tma-js-sdk-react)
- [Telegram developers community chat](https://t.me/devs_cis)
