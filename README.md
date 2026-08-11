# FashionHub Test Automation

Playwright + TypeScript test suite for the [FashionHub demo app](https://pocketaces2.github.io/fashionhub/).
Covers 4 test cases, runs cross-browser (Chromium, Firefox, WebKit) against multiple environments.

## Requirements

- Node.js v24.11.0
- Docker (to run the app locally)

## Quick start

```bash
git clone https://github.com/aniadabr/fashionhub-tests.git
cd fashionhub-tests
npm ci
npx playwright install
cp .env.example .env
```

Start the app locally (needed for the default `local` environment):

```bash
docker pull pocketaces2/fashionhub-demo-app 
docker run -p 4000:4000 pocketaces2/fashionhub-demo-app:latest
```

Run the whole suite:

```bash
npx playwright test
```

## Environments

| Name              | URL                                       |
| ----------------- | ----------------------------------------- |
| `local` (default) | http://localhost:4000/fashionhub/         |
| `staging`         | https://staging-env/fashionhub/ (dummy env)           |
| `production`      | https://pocketaces2.github.io/fashionhub/ |

Environment selection: the `TEST_ENV` variable (command line) takes priority; when absent,
the default comes from `config/environments.json`. An unknown value fails fast and lists
the valid options. Every run prints the resolved environment as its first line of output.

```bash
TEST_ENV=production npx playwright test
```

## Environment variables

Copy `.env.example` to `.env` (done in Quick start). The login credentials are public demo
data printed in the task itself, so the example file ships real values.

| Variable                                      | Required          | Purpose                                                 |
| --------------------------------------------- | ----------------- | ------------------------------------------------------- |
| `FASHIONHUB_USERNAME` / `FASHIONHUB_PASSWORD` | yes (login tests) | demo credentials                                        |
| `GITHUB_TOKEN`                                | no                | raises the GitHub API rate limit for the PR export test |

## Running tests

```bash
npx playwright test                        # all tests, all browsers, default env
npx playwright test --project=chromium     # one browser
npx playwright test login                  # one spec file
npx playwright show-report                 # HTML report of the last run
npm run typecheck                          # TypeScript check (the test runner does not check types)
```

## Test cases

| #   | Spec file                      | What it verifies                                                                                                                                                                |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TC1 | `tests/console-errors.spec.ts` | no console errors on any app page (parametrized); a negative test proves the detector catches the intentional error on `/about`                                                 |
| TC2 | `tests/links-statuses.spec.ts` | every `<a href>` link on the home page responds with a status < 400 (soft assertions report all broken links at once)                                                           |
| TC3 | `tests/login.spec.ts`          | login succeeds with valid demo credentials; invalid credentials show the error message (Page Object Model)                                                                      |
| TC4 | `tests/get-open-prs.spec.ts`   | fetches all open PRs of `appwrite/appwrite` via the GitHub REST API (paginated) and exports them to `output/open-prs.csv` (name, created date, author) with proper CSV escaping |

## Project structure

```
config/environments.json   environment registry (name → base URL)
src/config/                environment resolution (CLI > config file, fail-fast) + env helpers
src/data/                  page inventory for parametrized tests
src/fixtures/              custom fixtures (console error collector)
src/pages/                 Page Objects (login, account)
src/utils/                 pure helpers: link normalization, CSV building
tests/                     spec files (thin — logic lives in src/)
output/                    generated artifacts (git-ignored), e.g. open-prs.csv
```


## Running tests in Docker

```bash
docker build -t fashionhub-tests .
docker run --rm --env-file .env -e TEST_ENV=production fashionhub-tests
```

The image is based on the official Playwright image (browsers and system dependencies
included). Running against `local` from inside a container requires the app container on a
shared network — that is the next step (docker-compose).
