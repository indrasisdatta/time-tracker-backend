### Backend for Time tracker app using:

- NodeJS (Typescript), Express
- MongoDB, Mongoose ODM
- [Swagger](https://nerd-corner.com/import-swagger-in-node-typescript-project/) for API doc 
- Jest for [unit testing](https://losikov.medium.com/part-4-node-js-express-typescript-unit-tests-with-jest-5204414bf6f0) and [integration testing](https://javascript.plainenglish.io/beginners-guide-to-testing-jest-with-node-typescript-1f46a1b87dad)
- [Docker configuration](https://sachithsiriwardana.medium.com/dockerizing-nodejs-application-with-multi-stage-build-e30477ca572)
- Send email using [Nodemailer](https://nodemailer.com/) and [Handlebars](https://www.npmjs.com/package/handlebars)
- Validation schema, rules using [Joi](https://www.npmjs.com/package/joi)
- File upload using [Multer](https://www.npmjs.com/package/multer) and [Sharp](https://www.npmjs.com/package/sharp)
- JWT authentication using [Passport](https://www.npmjs.com/package/passport)

### Steps to run:
1. Create env files and set env vars as necessary (eg. DB_CON_STR)  
    - Copy .env.test.local to .env.local. 
    - Copy .env.test.production to .env.production  
2. Run `npm install` command
3. To run project locally using nodemon: `npm run dev`
4. To run all unit and integration tests in watch mode: `npm run test:watch`
5. To run only unit tests: `npm run test:unit`
6. To run only integration tests: `npm run test:int`

### Docker execution:

1. **Dev mode**: `docker-compose --env-file .env.local up -d`
    
2. **Production mode**: `docker-compose --env-file .env.production up -d`

Services are defined in `docker-compose.yml` file, which retrieves dynamic vars eg. `ENVIRONMENT`, `DOCKER_FILENAME`, `PORT` from the respective env files.
Dockerfile uses **multi-stage** build: 
- **Stage 1**: Install dependencies and dev depencies, run unit & integration tests and finally create a build (TS converted to JS). 

- **Stage 2**: Install only the required dependencies (not dev dependencies) and copy build code generated in previous stage. 
Finally start the application using npm start command.
   
### Swagger doc: http://localhost:5000/api-docs/
