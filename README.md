<h1 align="center" href="https://github.com/Hack-Alumni/hack-alumni-community">
    <img width="360" src="./apps/member-profile/public/images/hack-wordmark.png" />
</h1>

<p align="center"><b>Hack Alumni Community</b>: A fork of Oyster, the open-source software that powers the Hack.Diversity community experience. 🚀</p>

<h4 align="center">
  <a href="https://github.com/Hack-Alumni/hack-alumni-community/blob/main/CONTRIBUTING.md">How to Contribute</a> |
  <a href="https://hackalumni.org">Website</a> |
  <a href="https://app.hackalumni.org/apply">Community Application</a>
</h4>

<img src="./apps/member-profile/public/images/member-profile-home.png" width="100%" alt="Member Profile" style="border-radius: 8px;" />

# Hack Alumni Community

A fork of Oyster, the open-source software that powers the Hack.Diversity
community experience. 🚀

## About This Fork

This repository is a fork of the original
[Oyster project](https://github.com/colorstackorg/oyster) created by ColorStack.
We've adapted it to serve the Hack.Diversity community while maintaining the
core functionality and architecture of the original platform.

**Original Project**:
[ColorStack Oyster](https://github.com/colorstackorg/oyster) - The open-source
software that powers the ColorStack community experience.

## Database Architecture

**Important**: This application uses Supabase as the database provider. Here's
how the database configuration works:

### Database Configuration

- **Supabase provides PostgreSQL**: Supabase is a PostgreSQL-as-a-Service
  platform
- **DATABASE_URL**: Direct PostgreSQL connection string to Supabase's PostgreSQL
  instance
- **SUPABASE_URL**: Supabase project URL for Auth, Edge Functions, and other
  Supabase-specific features
- **Both point to the same database** but serve different purposes

### Example Configuration

```bash
# Direct PostgreSQL connection to Supabase
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Supabase project URL (for Auth, Edge Functions, etc.)
SUPABASE_URL=https://[PROJECT-REF].supabase.co
SUPABASE_ANON_KEY=[YOUR-SUPABASE-ANON-KEY]
```

### Where to Get These Values

1. **DATABASE_URL**: Supabase Dashboard → Settings → Database → Connection
   string (URI)
2. **SUPABASE_URL**: Supabase Dashboard → Settings → API → Project URL
3. **SUPABASE_ANON_KEY**: Supabase Dashboard → Settings → API → anon public

### Why Both Variables?

- **DATABASE_URL**: Used for direct PostgreSQL operations (queries, migrations,
  etc.)
- **SUPABASE_URL**: Used for Supabase-specific features (Auth, Edge Functions,
  etc.)

## Applications

- [**Member Profile**](./apps/member-profile/package.json) - Serves as the home
  for a Hack.Diversity member, allowing them to manage their information, find
  and connect with other members, as well as events and gamification.
- [**Admin Dashboard**](./apps/admin-dashboard/package.json) - An internal
  dashboard that the Hack.Diversity team uses to manage important workflows like
  application review.
- [**API**](./apps/api/package.json) - Handles all background jobs as well as
  any webhook integrations that we have with external services.

## Deployment

This project can be deployed in multiple ways:

### Vercel Deployment (Recommended)

For easy deployment as a single project, see our
[Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md).

### Traditional Deployment

For traditional deployment with Docker containers, follow the original setup
instructions in the [Contributing Guide](./CONTRIBUTING.md).

## Understanding the Codebase

### Important Tools & Technologies

Here is a list of important tools and technologies that power the Hack.Diversity
codebase:

- [BullMQ](https://docs.bullmq.io) to queue and process jobs asynchronously (in
  the background).
- [Kysely](https://kysely.dev) to query our SQL database in a type-safe way.
- [Node.js](https://nodejs.org/en/about)...because yes!
- [PostgreSQL](https://www.postgresql.org/docs/15/index.html) to store all of
  our data (provided by Supabase).
- [Railway](https://railway.app) to host our applications and databases.
- [Upstash Redis](https://upstash.com/docs/redis) for serverless Redis caching
  and data storage.
- [Remix](https://remix.run)/[React](https://react.dev) to build fast,
  accessible and delightful UI experiences.
- [Tailwind](https://tailwindcss.com) because scaling CSS is hard.
- [Turborepo](https://turbo.build/repo) to manage the build system for our
  Typescript monorepo.
- [Typescript](https://www.typescriptlang.org) because we like Javascript...and
  we like type checking.
- [Zod](https://zod.dev) to validate all of our data and automatically generate
  types.

### Folder Structure

Here is the structure of our Typescript monorepo:

```
apps
|--- admin-dashboard
|--- api
|--- member-profile
packages
|--- core
|--- db
|--- email-templates
|--- types
|--- ui
|--- utils
```

The `apps` directory houses all of our applications (see "Applications"
section).

The `packages` directory contains reusable pieces of code that are used across
our applications.

- `core`: Nearly all of our core business logic. Will eventually colocate
  feature-based UI next to its related business logic.
- `db`: Database layer, which houses all migrations, database scripts (ie:
  `seed`) and testing utilities that involve the database.
- `email-templates`: React-based email templates built with
  [Resend](https://resend.com).
- `types`: Miscellaneous types shared across applications.
- `ui`: Reusable UI components built in React.
- `utils`: Reusable utility functions, such as `sleep`.

### CI Pipeline (GitHub Actions)

To ensure that we don't have any breaking changes, we have a GitHub Actions
workflow that runs, which can block a PR from being merged if certain checks
don't pass.

For more information on how that CI pipeline works, see
[this](./.github/workflows/ci.yml) file.

### Deployment

We use [Railway](https://railway.app) to host our applications as well as our
PostgreSQL and Redis databases. Whenever we make some changes to our `main`
branch, Railway will automatically pick up those changes and deploy a new
version of our applications.

Each application has a `railway.json` file where we can configure certain
settings and instructions so Railway knows _how and when_ to build/start our
application. See [this](./apps/api/railway.json) file as an example. For a full
list on what we can configure, see
[here](https://docs.railway.app/reference/config-as-code#configurable-settings).

## Contributing

Please see our [contributing guide](./CONTRIBUTING.md)! 👋
