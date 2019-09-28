require('dotenv').config();
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const favicon = require('serve-favicon')
const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
app.use(favicon(path.join(__dirname, 'public/images/favicon.ico')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/signup', (req, res) => {
  res.render('signup')
})

app.listen(port, () => {
  console.log(`Server running on ${port}`)
})