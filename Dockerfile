# Stage 1: Install dependencies
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
COPY client/package.json client/
COPY server/package.json server/
RUN corepack enable && yarn install --immutable

# Stage 2: Build client
FROM deps AS client-build
WORKDIR /app
COPY client/ client/
COPY tsconfig.json ./
RUN yarn workspace @bff-admin/client build

# Stage 3: Build server
FROM deps AS server-build
WORKDIR /app
COPY server/ server/
COPY tsconfig.json ./
RUN yarn workspace @bff-admin/server build

# Stage 4: Production image
FROM node:22-slim AS production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY --from=deps /app/server/package.json ./server/
COPY --from=server-build /app/server/dist ./server/dist
COPY --from=client-build /app/client/dist ./client/dist

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server/dist/server.js"]
