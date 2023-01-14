# Choose the Image which has Node installed already
FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]