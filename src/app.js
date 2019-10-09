require('dotenv').config();
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const favicon = require('serve-favicon')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const passport = require('passport')
const { isAuthenticated } = require('./auth/auth-guard')
const express = require('express')
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const passportSocketIo = require("passport.socketio");
const port = process.env.PORT || 3000;

const userRouter = require('./routes/user')
const indexRouter = require('./routes/index')
const accountRouter = require('./routes/account')

// connect to database
mongoose.connect(
  process.env.DB_URI,
  { useNewUrlParser: true }
)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('open', () => console.log('Connection to database established'));

// serve favicon
app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')))

// view engine
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// serve static
app.use('/assets', express.static(path.join(__dirname, '/public')))

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// session
const sessionStore = new MongoStore({
  mongooseConnection: mongoose.connection
})

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))

// Passport
require('./auth/passport-local-config')(passport);
app.use(passport.initialize());
app.use(passport.session());

// connect-flash
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_flash = req.flash('success_flash')
  res.locals.error_flash = req.flash('error_flash')
  next();
})

// route handler
app.use('/', indexRouter);

app.use('/user', userRouter)

app.use('/account', isAuthenticated, accountRouter)

io.use(passportSocketIo.authorize({
  secret: process.env.SESSION_SECRET,
  store: sessionStore
}))

io.on('connection', (socket) => {
  const username = socket.request.user.username;
  console.log('user ' + username + ' connected');

  socket.join(`${username}`)

  socket.on('disconnect', function() {
    socket.leave(`${username}`)
  })

  socket.on('send friend request', (receiver) => {
    io.to(receiver).emit('received friend request', username, socket.request.user.avatarURL);
  })

  // console.log(io.sockets.adapter.rooms)
  
})

server.listen(port, () => {
  console.log(`Server running on ${port}`)
})