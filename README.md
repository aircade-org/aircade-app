<h1 align="center">AirCade</h1>

<p align="center">A browser-based party game platform where any screen becomes the console and everyone plays together using their phones as controllers.</p>

## Documentation

- [Specification](https://github.com/aircade-org/aircade-doc/blob/main/specification.md)
- [Milestone Roadmap](https://github.com/aircade-org/aircade-doc/blob/main/milstones.md)
- [Technical Stack](https://github.com/aircade-org/aircade-doc/blob/main/technical-stack.md)
- [OnBoarding](https://github.com/aircade-org/aircade-doc/blob/main/onboarding.md)

## What's inside?

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

```bash
# With global turbo installed (recommended)
turbo build

# Without global turbo
pnpm exec turbo build
```

### Develop

```bash
# With global turbo installed (recommended)
turbo dev

# Without global turbo
pnpm exec turbo dev
```
