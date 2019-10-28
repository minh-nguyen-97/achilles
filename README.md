# Achilles

A web application that simulates a social media, using Node.js, Express and MongoDB. 
Users can make a friend request, accept friend request and chat to friends.

Live demo [here](https://achilles-1997.herokuapp.com/)

## Getting started
### Prerequisites
Download Node.js and npm here: https://nodejs.org/en/
### Installation
1. `yarn install`
2. Create a .env file in root project folder
```
SESSION_SECRET=<a random string to secure the session>
DB_URI=<the connection string to MongoDB server>

# AWS Credentials
AWS_ACCESS_KEY_ID=<access key id>
AWS_SECRET_ACCESS_KEY=<secret access key>
AWS_REGION=<region-name>
AWS_BUCKET_NAME=<s3 bucket name>
```  
3. `yarn run start` 
4. Go to http://localhost:3000 to see your app.

## Built with
- [Express.js](https://github.com/expressjs/express) - Node.js web application framework
- [mongoose](https://github.com/expressjs/express) - MongoDB object modeling for Node.js
- [ejs](https://github.com/mde/ejs) - Template engine
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) - Hash user password
- [express-session](https://github.com/expressjs/session) - User session middleware
- [connect-mongo](https://github.com/jdesboeufs/connect-mongo) - Use MongoDB for persistent session store
- [Passport.js](https://github.com/jaredhanson/passport) - Passport.js for authentication middleware
- [passport-local](https://github.com/jaredhanson/passport-local) - Passport strategy for authenticating with a username and password
- [aws-sdk](https://github.com/aws/aws-sdk-js) - AWS SDK for JavaScript
- [multer](https://github.com/expressjs/multer) - Node.js middleware for handling multipart/form-data (uploading files/images)
- [multer-s3](https://github.com/badunk/multer-s3) - Upload images (user avatars) to AWS S3
- [socket.io](https://github.com/socketio/socket.io) - Real-time engine for sending and receiving friend requests and chat messages
- [passport.socketio](https://github.com/jfromaniello/passport.socketio) - Get session user in passport for each socket

## Authors and contributors
- Minh Nguyen