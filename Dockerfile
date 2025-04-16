FROM node:23.11.0-bookworm-slim AS base

WORKDIR /usr/src/app
COPY ./package.json ./package.json
RUN npm install --omit=dev --ignore-scripts
COPY . .

FROM base AS build

WORKDIR /usr/src/app
COPY --from=base --chown=node:node /usr/src /usr/src
USER node
RUN npm run build

ARG PORT=80
EXPOSE $PORT
ENV PORT=$PORT

CMD ["npm", "start"]