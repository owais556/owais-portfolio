# Muhammad Owais: Personal Site

The source for Muhammad Owais's personal site — a portfolio, résumé,
project archive, and writing site built with
[Next.js](https://nextjs.org/), [React](https://react.dev/),
[TypeScript](https://www.typescriptlang.org/), and
[Tailwind CSS](https://tailwindcss.com/).

Forked from [mldangelo/personal-site](https://github.com/mldangelo/personal-site).
The architecture is reusable and MIT licensed. The content and visual design
are personal, so a fork needs a full rebrand.

## What is here

- A statically exported Next.js 16 site deployed to Vercel.
- A responsive light/dark design system built from semantic CSS tokens.
- Markdown writing with drafts, RSS, and page metadata.
- A filterable résumé that still prints in full.
- Tests for components, content, metadata, and the final static export.

## Get started

### With a coding agent

Open your fork in a coding agent and ask:

```text
Read AGENTS.md, use the Node version in .nvmrc, install the locked
dependencies, and start the development server. Do not change the site yet.
Tell me the local URL and report any setup failure with its exact output.
```

### Manual setup

With [GitHub CLI](https://cli.github.com/) and
[nvm](https://github.com/nvm-sh/nvm) installed:

```bash
gh repo fork mldangelo/personal-site --clone
cd personal-site
nvm install
npm ci
npm run dev
```

If you use another version manager, choose a release accepted by `engines.node`
in `package.json`.

### GitHub Codespaces

1. Click **Fork** at the top of this page.
2. In your fork, click **Code**, choose **Codespaces**, then create a codespace.
3. Run:

```bash
nvm install
npm ci
npm run dev
```

Codespaces provides the tools, so you do not need to install them locally.

## Adapt it with a coding agent

When you are ready to customize the site, give the agent your résumé, profile
details, links, images, and intended site URL. Try:

```text
Read AGENTS.md and docs/adapting-guide.md, set up the repository, then rebrand
this fork for [NAME] with the details and assets I provide. Work on a topic
branch and preserve the current routes and design unless I say otherwise.
Inventory the existing posts, external writing, résumé, and projects before
changing the shared identity. Do not relabel that content as mine. Ask whether
unmatched personal content should keep its original attribution, be replaced,
or be removed. Use the guide's reference map to update every identity surface
and generated asset. Search for remaining upstream details and run the full
validation suite. Do not commit, push, merge, change GitHub settings, create
secrets, or modify DNS. Report the external steps that remain.
```

The **[adapting guide](./docs/adapting-guide.md)** has focused prompts for
writing, feature removal, visual changes, and deployment, plus a map of the
files an agent should inspect.

## Commands

```bash
npm run dev             # Start the development server
npm run format          # Format with Prettier and Biome
npm run lint            # Run Biome checks
npm run type-check      # Run TypeScript
npm test                # Run Vitest
npm run build           # Build the production static export
npm run verify-export   # Inspect the generated HTML and XML
npm run og              # Regenerate the share card
npm run og:check        # Verify the committed share card is current
```

CI checks formatting, linting, types, the share card, tests, the production
build, and the exported site on every pull request.

## Deploy

Import the repository on [Vercel](https://vercel.com) with the default
Next.js preset: `npm run build` produces the static export, and every push
to `main` deploys it automatically. The canonical URL is compiled from
`SITE_URL` in `src/lib/utils.ts` — update it if the domain changes.

## Contributing

See the [contributing guide](./docs/contributing.md) for setup, branch and commit
conventions, validation, and pull request expectations.

## License

[MIT](./LICENSE). Use it however you want.
