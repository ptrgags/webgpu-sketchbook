# webgpu-sketchbook

## Running Dev server in VSCode Dev Container

If you have Docker installed, VS Code should prompt
you to reopen in container automatically.

However, to get it to expose the port correctly,
you need to use the `--host` flag in the container:

```sh
npm run dev -- --host
```

This will not work silently without the `--` which
gets confusing.

## Release

Every time a PR is merged into `main`, the GitHub action (see `.github/workflows/deploy.yml`) 
will automatically deploy it to GitHub Pages so I can iterate quickly.

Make sure to double-check the [actions tab](https://github.com/ptrgags/webgpu-sketchbook/actions)
to make sure the job deployed correctly
