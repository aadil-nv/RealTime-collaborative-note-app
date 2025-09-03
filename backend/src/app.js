const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const noteRoutes = require('./routes/note.route');
const errorHandler = require('./middlewares/errorMiddleware');
const userRoutes = require('./routes/user.route');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Notes API is running');
});

app.use(errorHandler);

module.exports = app;
