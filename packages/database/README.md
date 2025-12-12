# @repo/database

Shared Prisma ORM package for the monorepo.

## Setup

1. Create a `.env` file in this directory with your database connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/aircade"
```

2. Generate the Prisma Client:

```bash
pnpm db:generate
```

## Usage

### In NestJS (apps/api)

```typescript
import { prisma } from '@repo/database';

// Use in a service
const users = await prisma.user.findMany();
```

### In Next.js (apps/web)

```typescript
import { prisma, type User, type Post } from '@repo/database';

// Use in API routes or server components
const users = await prisma.user.findMany();

// Types are available too
const user: User = {
  id: '1',
  email: 'user@example.com',
  name: 'John Doe',
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

## Available Commands

- `pnpm db:generate` - Generate Prisma Client from schema
- `pnpm db:push` - Push schema changes to database (dev only)
- `pnpm db:studio` - Open Prisma Studio to view/edit data
- `pnpm db:migrate` - Create and apply migrations

## Schema Location

The Prisma schema is located at `prisma/schema.prisma`. Modify it to add your models and run `pnpm db:generate` to regenerate the client.

## Example Files

The monorepo includes example files to help you get started:

- `apps/api/src/prisma.service.ts` - NestJS service for Prisma connection management
- `apps/api/src/users/users.service.example.ts.template` - Example NestJS service using Prisma
- `apps/web/app/api/users/route.example.ts.template` - Example Next.js API route using Prisma
- `apps/web/app/users/page.example.tsx.template` - Example Next.js server component using Prisma

To use the templates, rename them by removing the `.template` extension.

## Notes

- The Prisma Client is generated to `node_modules/.prisma/client` to ensure it's accessible across the monorepo
- The database connection uses a singleton pattern to prevent connection exhaustion
- In development, query logs are enabled for debugging
- Make sure to run `pnpm db:generate` after modifying the schema before building your apps
