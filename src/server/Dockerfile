# Choose the Image which has Node installed already
FROM node:lts-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json /app

# Install app
RUN npm ci

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY server /app

# copy shared directory to location
RUN mkdir -p /shared
COPY shared /shared

# Run build command
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]