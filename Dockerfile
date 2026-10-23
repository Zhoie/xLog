##### BASE
FROM node:22.23.4-bookworm-slim as base

RUN apt-get update && apt-get install --no-install-recommends python3 build-essential git -y \
    && rm -rf /var/lib/apt/lists/*

RUN npm i -g pnpm@10.34.7

##### DEPS
FROM base as deps

WORKDIR /app

ADD . .

RUN pnpm i --frozen-lockfile

##### BUILD
FROM deps as build

WORKDIR /app

COPY --from=deps /app /app

ARG NEXT_PUBLIC_DISCORD_LINK
ENV NEXT_PUBLIC_DISCORD_LINK ${NEXT_PUBLIC_DISCORD_LINK}
ARG NEXT_PUBLIC_GITHUB_LINK
ENV NEXT_PUBLIC_GITHUB_LINK ${NEXT_PUBLIC_GITHUB_LINK}
ARG NEXT_PUBLIC_OUR_DOMAIN
ENV NEXT_PUBLIC_OUR_DOMAIN ${NEXT_PUBLIC_OUR_DOMAIN}
ARG NEXT_PUBLIC_TWITTER_LINK
ENV NEXT_PUBLIC_TWITTER_LINK ${NEXT_PUBLIC_TWITTER_LINK}

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV BUILD_STEP=1
ARG GIT_SHA
ENV GIT_SHA=${GIT_SHA}
RUN test -n "$GIT_SHA"
RUN pnpm build

##### FINAL
FROM node:22.23.4-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/.next/standalone /app
COPY --from=build /app/public /app/public
COPY --from=build /app/.next/static /app/.next/static

CMD ["node", "server.js"]

