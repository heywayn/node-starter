# BUILDER - Stage 1
FROM node:22-alpine AS builder
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat
COPY . .

# INSTALLER - Stage 2
FROM node:22-alpine AS installer
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat
RUN npm install --global --no-update-notifier --no-fund pnpm@9.5.0

# First install the dependencies (as they change less often)
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm fetch

# Build the project
COPY --from=builder /app .
RUN pnpm install --prefer-offline --ignore-scripts

# DEVELOPMENT - Stage 3
FROM installer AS development
CMD pnpm dev

# RUNNER - Stage 4
FROM node:22-alpine AS runner
WORKDIR /app
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update && apk add --no-cache libc6-compat
RUN npm install --global --no-update-notifier --no-fund ts-node@10.9.2 tsconfig-paths@4.2.0

# Don't run production as root
RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app
USER app

COPY --from=installer /app .

EXPOSE 3001

CMD ["ts-node", "-r", "tsconfig-paths/register", "./src/server.ts"]
