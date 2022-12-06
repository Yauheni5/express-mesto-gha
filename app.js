const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/user');
const cardsRoutes = require('./routes/card');

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '638ef433b633e89b5614c513',
  };

  next();
});

/* module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id станет доступен
}; */

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
