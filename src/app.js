/* eslint-disable linebreak-style */
const express = require('express');
const app = express();
const PORT = 9000;
const { addBook, getAllBooks, getBookById, updateBook, deleteBook } = require('./controller');
const timeout = require('connect-timeout');

app.use(express.json());
app.use(timeout('10s'));

app.route('/books')
  .post((req, res) => addBook(req, res))
  .get((req, res) => getAllBooks(req, res));

app.route('/books/:id')
  .get((req, res) => getBookById(req, res))
  .put((req, res) => updateBook(req, res))
  .delete((req, res) => deleteBook(req, res));

app.listen(PORT, () => {
  if (process.env.npm_lifecycle_event === 'start-dev') {
    console.log(`App succesfully run on PORT ${PORT}`);
  }
});