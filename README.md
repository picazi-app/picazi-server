This is the backend for for reduxtagram-client repo. It's using Nodejs,
MongoDb, TypeScript, bcrypt, express-session, redis-server, aws, multer-s3. This 
app is inspired from wesbos redux course.


## Features:
- Sign-up & login
- Upload pics you love!
- Share your post url to receive comments and likes ❤


## Technologies used:

#### Client side
- [React](Create-React-App)
- Redux
- Typescript
- Axios


#### Server side
- Nodejs
- Typescript
- Mongoose
- Redis
- aws-sdk & multer-s3


#### Cloud services
- Hosting - AWS
- Storing images - AWS S3


## Steps to install
In order to run the app in browser, you would first require to install NodeJS, Mongodb and Redis

- [NodeJS](https://nodejs.org/en/download/)
- [MongoDB](https://docs.mongodb.com/manual/administration/install-community)
- [Redis](https://redis.io/)

Next, install reduxgram-server and reduxtagram-client.

#### Reduxtagram-server
- `git clobe git@github.com:personal-pooya/reduxtagram-server.git`
- Run `npm install`
- Run `npm start`

Server will get started on port 4000.

#### Reduxtagram-client
- `git clone git@github.com:personal-pooya/reduxtagram-client.git`
- Run `npm install`
- Run `npm start`

This will start the client app on port 3000.


## Alternatively, you can also install it using docker
- Install docker
- Clone both the repos
- build the Images:

  For reduxtagram-client repo:
  - `docker build -t  my-reduxtagram-image .`
  
  For reduxtagram-server repo:
  - `docker build -t reduxtagram-server-image .`

Note: These images name should match `image` key inside docker-compose.yml file.

- Last, run `docker-compose up` from reduxtagram-server repo to run all the containers.


### For reduxtagram-server
For any bugs, improvements, or feature requests feel free to create an issue [here](https://github.com/personal-pooya/reduxtagram-server/issues/new) with expected result.

### For reduxragram-client
For any bugs, improvements, or feature requests feel free to create an issue [here](https://github.com/personal-pooya/reduxtagram-client/issues/new) with expected result.
