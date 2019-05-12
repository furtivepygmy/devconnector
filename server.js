const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const connectDB = require('./config/db');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect database
connectDB();

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport.js')(passport);

// Define routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

/************************************************************************/

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
