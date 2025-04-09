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

After merging all desired PRs into `main`, I follow these steps to publish to `gh-pages`. I use a second copy of the repo cloned elsewhere.

For the example below, the main repo is `/path/to/website`, and the `gh-pages` version is `/path/to/website-publish`.

```
# This makes a build in the dist/ subdirectory

cd /path/to/website/
npm run build

# remove the old build files and add the new ones

cd /path/to/website-publish/
rm -r *
cp -r /path/to/website/dist/* .

# Using a static file server (such as http-server), host the publish directory

# and double check that everything looks right.

# Finally, check in the changes to gh-pages and push to GH
```
