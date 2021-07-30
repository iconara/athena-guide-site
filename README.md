# The Athena Guide

This repository contains the code that generates [The Athena Guide](https://the.athena.guide/).

The site is built using [Nuxt.js](https://nuxtjs.org).

## Development

Install all dependencies:

```bash
$ yarn install
```

Run the development server for day-to-day development, this starts a server on [localhost:3000](http://localhost:3000/):

```bash
$ yarn dev
```

Run the tests:

```bash
$ yarn jest --watch
```

### Update content

The content is hosted in a separate repository, [iconara/athena-guide-content](https://github.com/iconara/athena-guide-content) and included into this repository using `git subtree`. To update anything in `content/` make a change in the source repository and then run:

```bash
$ git subtree pull --prefix content content master --squash
```

## Deployment

Push the repository to GitHub and Amplify Console will build and deploy. See `config/hosting.cnf.yml`.
