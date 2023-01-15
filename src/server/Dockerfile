# Choose the Image which has Node installed already
FROM node:lts-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# copy shared directory to location
COPY ../shared /shared

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]