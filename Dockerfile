# Stage 1: Build dependencies
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

# Stage 2: Production runtime
FROM node:20-alpine AS runtime

ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY package*.json ./
COPY server.js ./
COPY config/ ./config/
COPY controllers/ ./controllers/
COPY middleware/ ./middleware/
COPY models/ ./models/
COPY routes/ ./routes/
COPY views/ ./views/

EXPOSE 3001

USER node

CMD ["node", "server.js"]
