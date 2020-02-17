FROM node:12 as builder
WORKDIR /app

# Install dependencies
COPY ./package.json ./yarn.lock ./
RUN yarn

# Build
COPY ./tsconfig.json ./
COPY ./src ./src
COPY ./scripts ./scripts
RUN yarn build

FROM node:12-alpine
WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./

RUN yarn install --production --ignore-scripts --prefer-offline

COPY --from=builder /app/dist ./dist

CMD yarn run start