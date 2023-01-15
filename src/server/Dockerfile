# Choose the Image which has Node installed already
FROM node:lts-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# copy shared directory to location
CMD [ "mkdir", "-p", "/shared" ]
COPY ../shared /shared

# Install app
RUN npm install

# Run build command
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]