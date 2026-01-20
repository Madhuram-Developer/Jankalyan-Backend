FROM node:20-alpine

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm install

COPY . .

RUN npm run build   # tsc → dist/

EXPOSE 8800
CMD ["node", "dist/index.js"]
