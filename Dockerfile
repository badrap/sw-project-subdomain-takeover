FROM node:20

WORKDIR /app
COPY package*.json ./
RUN npm install

WORKDIR /app/demo/webserver
COPY demo/webserver/package*.json ./
RUN npm install

WORKDIR /app
COPY . .

WORKDIR /app/demo/webserver
ENV CHOKIDAR_USEPOLLING=true
EXPOSE 3000
# CMD ["npx", "ts-node-dev", "src/index.ts"]
CMD ["npm", "run", "dev"]

# docker build -t webserver .
# docker run -p 3000:3000 webserver