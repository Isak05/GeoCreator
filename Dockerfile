FROM node:23.11.0-bookworm-slim AS base

WORKDIR /usr/src/app
COPY . .
RUN npm install --omit=dev --ignore-scripts

FROM base AS build

WORKDIR /usr/src/app
COPY --from=base --chown=node:node /usr/src/app /usr/src/app
RUN npm run build

USER node

ARG PORT=80
EXPOSE $PORT
ENV PORT=$PORT

CMD ["npm", "start"]