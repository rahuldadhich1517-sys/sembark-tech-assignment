# Sembark Tech Assignment

A small React + TypeScript + Vite e-commerce demo with product listing, category filters, sorting, cart management, and product detail navigation.

## Prerequisites

- Node.js 18+ or compatible LTS
- npm 10+ (or yarn/pnpm if preferred)

## Setup

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

## Environment files

This project uses Vite mode-specific environment files:

- `.env.development`
- `.env.staging`
- `.env.production`

Each file is loaded when running Vite with the corresponding mode.

## Run locally

Start the development server:

```bash
npm run dev
```

Open the app at `http://localhost:5173`.

## Build

Build for production:

```bash
npm run build
```

Build for development mode:

```bash
npm run build:development
```

Build for staging mode:

```bash
npm run build:staging
```

## Preview

Preview the production build:

```bash
npm run preview
```

Preview the staging build:

```bash
npm run preview:staging
```

## Testing

Run Cypress end-to-end tests:

```bash
npm run test:e2e
```

## Project structure

- `src/` – React application source
- `src/pages/` – page components
- `src/components/` – shared UI components
- `src/context/` – application state providers
- `src/api.ts` – API helper methods
- `src/types.ts` – TypeScript types

## Notes

- Filters and sorting state are preserved in the URL to support refresh, back navigation, and shareable links.
- Cart quantities can be adjusted directly in the cart page.
- Product items in the cart link to their detail pages.
