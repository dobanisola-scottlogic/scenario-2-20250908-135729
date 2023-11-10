# Hackathon UI

## About

React + TypeScript app for the Hackathon UI created using Vite.

[Vite](https://vitejs.dev/) is a build tool that aims to provide a faster development experience for modern web projects. It does so by leveraging bundler tools like esbuild, as opposed to those such as webpack.
This application uses the official plugin [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) which uses [Babel](https://babeljs.io/) for Fast Refresh.

## Getting Started

Required:

- [Node.js](https://nodejs.org/en/) (v18.18.2)

To install dependencies:

```
cd ui
npm install
```

To start the application on [localhost:5173](http://localhost:5173):

```
npm run dev
```

To build the application:

```
npm run build
```

## Running with the backend

Run the backend via the Gradle application run task. Running the task in the root directory will bundle the UI and server together on [localhost:8080/application](http://localhost:8080/application). Currently, this loads the old viewer. The new UI can be accessed at [localhost:8080/application/ui](http://localhost:8080/application/ui), and the API at [localhost:8080/application/api](http://localhost:8080/application/api). Running the task in the server directory will run the API only.

### CORS errors

To allow [localhost:5173](http://localhost:5173) to make API calls to the backend at [localhost:8080/application/api](http://localhost:8080/application/api), you need to modify the run configuration to use the environment variable `ENVIRONMENT=dev`. Without this, you will encounter CORS issues when trying to develop locally on [localhost:5173](http://localhost:5173) against the API.

## Formatting

The application uses [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for linting and formatting. These are applied on commit using [lint-staged](https://www.npmjs.com/package/lint-staged) and [Husky](https://typicode.github.io/husky/#/), alongside a check for type errors.

To fix formatting, run this command in the ui directory:

```
npm run format
```

This runs prettier write, eslint fix, and tsc (type checking). To run each part individually, see scripts in `package.json`.

## Testing

Unit tests are set up using the following:

- [Vitest](https://vitest.dev/) as test runner
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [msw v2](https://mswjs.io/) to mock API calls

The application also uses [Playwright](https://playwright.dev/) for e2e testing.
