# Prisma ORM Setup

## Quick Start

1. **Configure database connection**

   Create a `.env` file in `packages/database/`:
   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/aircade"
   ```

2. **Generate Prisma Client**
   ```bash
   cd packages/database
   pnpm db:generate
   ```

3. **Use in your apps**
   ```typescript
   import { prisma, type User, type Post } from '@repo/database';

   const users = await prisma.user.findMany();
   ```

## Package Structure

- `packages/database` - Shared Prisma package
  - `prisma/schema.prisma` - Database schema
  - `src/index.ts` - Exports Prisma client and types
  - Package is already added as dependency in `apps/api` and `apps/web`

## Available Commands

Run these from the root or from `packages/database`:

- `pnpm db:generate` - Generate Prisma Client
- `pnpm db:push` - Push schema to database (dev)
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:migrate` - Create and run migrations

## Turbo Integration

The following tasks have been added to `turbo.json`:
- `db:generate` - Generates Prisma Client
- `db:push` - Pushes schema changes
- `db:studio` - Opens Prisma Studio

## Example Files

Example implementations are available:
- `apps/api/src/prisma.service.ts` - NestJS Prisma service
- `apps/api/src/users/users.service.example.ts.template`
- `apps/web/app/api/users/route.example.ts.template`
- `apps/web/app/users/page.example.tsx.template`

Rename `.template` files to use them.

## Workflow

1. Modify `packages/database/prisma/schema.prisma`
2. Run `pnpm db:generate` to update Prisma Client
3. Build your apps - they will use the updated types

For more details, see `packages/database/README.md`.
