# repo-lint-www

> A static front-end for [**repo-lint**](https://github.com/pdehaan/repo-lint).

## WHY

We want to be able to quickly look at a GitHub repository and see if it has the expected files or unexpected issues.

## HOW

The site is built pseudo-dynamically based on the array of repositories in [src/_data/repos.js](src/_data/repos.js).

By running the <kbd>npm run fetchdata</kbd> npm script (which in turn calls [scripts/fetchdata.js](scripts/fetchdata.js)), and uses the [**repo-lint**](https://github.com/pdehaan/repo-lint/) module to fetch the repository details and files using the GitHub API. The fetched data is written to the 11ty site's [src/_data/_repos/*](src/_data/_repos) directory using the GitHub org name as the folder name, and the repo name as the folder name. For example, if we fetch the repo of "mozilla/experimenter", the data file would be written to src/_data/_repos/mozilla/experimenter.json.

Each new repo added to [src/_data/repos.js](src/_data/repos.js) requires 2 GitHub API calls, so if we can add about 30 repos total before we need to figure out an easy way to generate GitHub Personal Access Tokens and uses the authenticated API. Ideally we'd set this up as a nightly cron job using GitHub Actions, so the site will regenerate and deploy every night automatically (or on-demand whenever a new PR is merged, in case somebody adds a new repo to the [src/_data/repos.js](src/_data/repos.js) file).

## DEPLOYING

Currently the site is deployed manually using the following steps:

1. <kbd>npm run fetchdata</kbd> &mdash; Fetches the latest repo data via the GitHub API and saves the file in 11ty's _data directory for use w/ pagination. We run this separately since we might want to deploy 5 times for front-end updates, but we don't need newer GitHub data, so we save a few rate-limited API calls.
2. <kbd>npm run deploy</kbd> &mdash; Uses the "predeploy" npm hook to run the "build:prod" and "prettier:output" scripts:
    - <kbd>npm run build:prod</kbd> &mdash; Builds the site locally, setting the `--pathprefix` 11ty config so it works with GitHub pages (since GitHub annoyingly puts the site in a subdirectory, which we don't have if we are developing locally).
    - <kbd>npm run prettier:output</kbd> &mdash; Runs [Prettier](https://prettier.io/) on the generated output files before deploying, so I can see better formatted HTML (and it also doubles as a cheap HTML linter).
    - Runs <kbd>gh-pages -d www/repo-lint-www</kbd> to publish the generated (and now formatted) output files to GitHub pages.
