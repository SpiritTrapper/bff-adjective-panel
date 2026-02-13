# BFF Admin Panel

A white-label admin panel for managing events, news, and promotional content. Built as a full-stack monorepo with a React 19 client and an Express 5 BFF (Backend for Frontend) server.

## Architecture

```
┌─────────────┐       ┌─────────────┐       ┌──────────────────┐
│   Browser    │──────▶│    Nginx    │──────▶│  Express BFF     │──────▶  External API
│  (React SPA) │◀──────│  (reverse   │◀──────│  (cookie-based   │◀──────  (configured via
│              │       │   proxy)    │       │   auth proxy)    │        API_URL env var)
└─────────────┘       └─────────────┘       └──────────────────┘
```

The BFF server acts as a secure proxy between the browser and your external API. It handles JWT authentication by storing tokens in httpOnly cookies, so they are never exposed to client-side JavaScript. All API requests from the client go through `/api/*` routes on the BFF, which forwards them to the external API defined by `API_URL`.

### Monorepo Structure

```
bff-adjective-panel/
├── client/                 # React 19 SPA (Vite 7)
│   ├── src/
│   │   ├── api/            # Axios gateway with token refresh interceptor
│   │   ├── assets/images/  # SVG logos (imported as React components)
│   │   ├── components/     # Custom components + shadcn/ui
│   │   ├── contexts/       # AuthContext, TablesSchemaContext
│   │   ├── hooks/          # Shared hooks (mutations, filters, modals)
│   │   ├── i18n/           # i18next config + translation JSON files
│   │   ├── lib/            # Types, utils, constants, web-vitals
│   │   ├── pages/          # Route-level page components
│   │   ├── App.tsx         # Root providers (SWR, Auth, Router)
│   │   ├── Router.tsx      # Route definitions with lazy loading
│   │   └── MainLayout.tsx  # Sidebar + header layout shell
│   ├── vite.config.ts
│   └── package.json
├── server/                 # Express 5 BFF proxy
│   ├── handlers/           # Route handlers (login, promo CRUD, news, events)
│   ├── lib/helpers.ts      # Cookie token utilities
│   ├── server.ts           # Express app entry point
│   └── package.json
├── docker-compose.yml      # Express + Nginx services
├── Dockerfile              # Multi-stage production build
├── nginx.conf              # Reverse proxy, gzip, caching, SPA fallback
└── package.json            # Yarn workspaces root
```

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Client** | React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4 |
| **UI** | shadcn/ui (Radix UI primitives), Lucide icons |
| **State** | SWR (data fetching), React Hook Form + Yup (forms) |
| **Tables** | TanStack React Table v8 |
| **i18n** | react-i18next, i18next-browser-languagedetector |
| **Server** | Express 5, Axios, Multer (file uploads), JWT decode |
| **Build** | Yarn 4 workspaces, Lerna, Vite, TypeScript |
| **Deploy** | Docker multi-stage build, Nginx reverse proxy |

## Prerequisites

- **Node.js** >= 22
- **Yarn** >= 4.6.0 (corepack)
- **Docker** and **Docker Compose** (for production deployment)

## Setup

### 1. Clone and install

```bash
git clone <repository-url>
cd bff-adjective-panel
corepack enable
yarn install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
NODE_ENV=development
API_URL=https://your-api-domain.com/api/v1
VITE_API_URL=https://your-api-domain.com/api/v1
PROXY_PORT=3000
```

| Variable | Description |
|----------|-------------|
| `API_URL` | The external API base URL that the BFF server proxies requests to |
| `VITE_API_URL` | Same API URL, exposed to the Vite client build (used by the Axios gateway) |
| `PROXY_PORT` | Port the Express BFF server listens on (default: `3000`) |
| `NODE_ENV` | `development` or `production` |

### 3. Run in development

```bash
yarn dev
```

This starts both workspaces in parallel:
- **Client** at `http://localhost:4000` (Vite dev server with HMR)
- **Server** at `http://localhost:3000` (Express with tsx watch)

The Vite dev server proxies `/api/*` requests to the Express server automatically.

### 4. Build for production

```bash
yarn build
```

This builds both workspaces:
- Client: `client/dist/` (static SPA bundle)
- Server: `server/dist/` (compiled JavaScript)

### 5. Deploy with Docker

```bash
docker compose up --build -d
```

This creates two containers:
- **server** -- Express BFF on port 3000 (internal)
- **nginx** -- Reverse proxy on port 80 (public), serves the static client build and proxies `/api/` to Express

## Internationalization (i18n)

The app ships with English and Russian translations, bundled statically at build time (no async loading, no FOUC).

**Supported languages:** English (`en`), Russian (`ru`)

**Namespaces:** `common`, `auth`, `dashboard`, `events`, `news`, `promo`, `tables`, `validation`

Translation files are located at:
```
client/src/i18n/locales/
├── en/
│   ├── common.json
│   ├── auth.json
│   ├── dashboard.json
│   ├── events.json
│   ├── news.json
│   ├── promo.json
│   ├── tables.json
│   └── validation.json
└── ru/
    └── ... (same structure)
```

Language detection order: `localStorage` > browser navigator. Users can switch languages via the toggle button in the header. The choice is persisted to `localStorage`.

### Adding a new language

1. Create a new folder under `client/src/i18n/locales/<lang>/` with all 8 namespace JSON files
2. Import the files in `client/src/i18n/index.ts` and add them to the `resources` object
3. Update the `LanguageSwitcher` component to include the new language option

## API Routes

The BFF server exposes these endpoints (all prefixed with `/api`):

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Authenticate with email/password |
| POST | `/api/logout` | Clear auth cookies |
| POST | `/api/refresh` | Refresh JWT tokens |
| GET | `/api/promo-list` | List promos (paginated, filterable) |
| GET | `/api/get-promo` | Get single promo by ID |
| POST | `/api/create-promo` | Create a new promo |
| PATCH | `/api/update-promo` | Update an existing promo |
| DELETE | `/api/delete-promo` | Delete a promo |
| POST | `/api/upload-promo-image` | Upload promo image (multipart) |
| GET | `/api/get-news` | Search news |
| GET | `/api/get-events` | Search events |
| GET | `/api/get-complexity` | Event complexity levels |
| GET | `/api/get-themes` | Event themes |
| GET | `/api/get-types` | Event type categories |

## Client Pages

| Route | Page | Description |
|-------|------|-------------|
| `/login` | LogIn | Email/password authentication |
| `/dashboard` | Dashboard | Summary stats overview |
| `/events` | Events | Event list with filters (format, complexity, theme, type, date range) |
| `/news` | News | News list with filters (name, active status) |
| `/promo/events` | Promo | Event promotions with status/location tabs |
| `/promo/news` | Promo | News promotions with filters |
| `/add` | Add | Advertisement/ad promo management |

All authenticated routes are protected and require admin privileges. Unauthenticated users are redirected to `/login`.

## Performance

The build is optimized for Core Web Vitals:

- **Code splitting** -- route-level lazy loading with `React.lazy()` + `Suspense`
- **Vendor chunks** -- manual chunk splitting (react, radix, table, i18n, form, icons, date, toast, color) for optimal caching
- **CSS** -- minified with lightningcss, Tailwind CSS 4 with Vite plugin
- **Assets** -- hashed filenames with 1-year cache headers via Nginx
- **Compression** -- Nginx gzip on all text-based assets
- **Data fetching** -- SWR with `keepPreviousData` to prevent layout shift
- **Font loading** -- `display=swap` with preconnect hints
- **Dependency pre-bundling** -- all major Radix UI packages pre-bundled by Vite
- **Web Vitals reporting** -- built-in performance monitoring in development

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start both client and server in development mode |
| `yarn build` | Build both workspaces for production |
| `yarn start` | Start both workspaces in production mode |
| `yarn lint` | Run ESLint across client |
| `yarn cleanup` | Remove all node_modules |
