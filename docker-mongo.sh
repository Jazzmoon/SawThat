docker run -d
  -p 27017:27017
  --name mongoDB
  -e MONGO_INITDB_DATABASE=SawThat
  -e MONGO_INITDB_ROOT_USERNAME=sawthat
  -e MONGO_INITDB_ROOT_PASSWORD=sawthatsecretpass
  mongo:4.4.18