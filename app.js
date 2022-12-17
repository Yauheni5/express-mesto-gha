const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { login, createUser } = require('./contollers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, usersRoutes);
app.use('/cards', auth, cardsRoutes);

app.use((err, req, res) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.all('/*', (req, res) => res.status(404).send({ message: 'Данной страницы не существует!' }));
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
