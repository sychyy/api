FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN apk add --no-cache pixman pixman-dev cairo cairo-dev pango pango-dev
RUN npm install

COPY . .

CMD ["node", "index.js"]