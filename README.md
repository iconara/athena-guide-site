# The Athena Guide

This repository contains the code that generates [The Athena Guide](https://the.athena.guide/).

The site is built using [Vitepress](https://vitepress.dev/).

## Development

Install all dependencies:

```bash
$ yarn install
```

Run the development server for day-to-day development, this starts a server on [localhost:5173](http://localhost:5173/):

```bash
$ yarn dev
```

### Update content

The content is hosted in a separate repository, [iconara/athena-guide-content](https://github.com/iconara/athena-guide-content) and included into this repository using `git subtree`. To update anything in `content/` make a change in the source repository and then run:

```bash
$ git subtree pull --prefix content content master --squash
```

If you want to pull in content from a different branch just replace `master` with the name of a branch from [iconara/athena-guide-content](https://github.com/iconara/athena-guide-content/branches).

## Deployment

Push the repository to GitHub and Amplify Console will build and deploy.

For changes to the hosting setup, edit `template.yml` and run:

```bash
$ sam build
$ sam deploy
```

Add `--guided` to the deploy command the first time to set up the stack.

