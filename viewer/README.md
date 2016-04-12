# Hackathon Viewer

# Development

The application is built using ES2015, transpiled via Babel.

### Initial Setup

[npm](https://www.npmjs.com/), the package manager for [Node.js](https://nodejs.org/), is used to manage the project's dependencies.

- Download or clone this repository locally
- Ensure [Node.js](https://nodejs.org/), which includes npm, is installed
- Navigate to the root of your local copy of this project and install the dependencies:
```
npm install
```

#### Running locally

- Start the webpack development server
```
npm start
```
This binds a small express server on http://localhost:8080. It automatically updates the browser page when a bundle is recompiled. Open http://localhost:8080/webpack-dev-server/bundle in your browser.

#### Testing
[Jasmine](http://jasmine.github.io/) is the testing framework used within this project for testing JavaScript.

Run the tests using:
```
npm test
```
