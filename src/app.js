require('dotenv').config();
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const favicon = require('serve-favicon')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const passport = require('passport')
const express = require('express')
const app = express();
const port = process.env.PORT || 3000;

const userRouter = require('./routes/user')
const indexRouter = require('./routes/index')

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
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))

// Passport
require('./auth/passport-local-config')(passport);
app.use(passport.initialize());
app.use(passport.session());

// connect-flash
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_flash = req.flash('success_flash')
  res.locals.error = req.flash('error')
  next();
})

// route handler
app.use('/', indexRouter);

app.use('/user', userRouter)

app.listen(port, () => {
  console.log(`Server running on ${port}`)
})