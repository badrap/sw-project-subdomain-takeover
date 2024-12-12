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
EXPOSE 3000
RUN npm run build
CMD ["npm", "run", "start"]

# docker build -t webserver .
# docker run -p 3000:3000 webserver