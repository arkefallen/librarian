/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const books = [];

async function addBook(req, res) {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    });
  }

  if (!year || !publisher || !author) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Informasi tahun, penerbit, dan penulis buku tidak boleh kosong'
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
  }

  if (readPage < 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh bernilai negatif'
    });
  }

  const id = nanoid();
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  books.push({
    id: id,
    name: name,
    year: year,
    author: author,
    summary: summary,
    publisher: publisher,
    pageCount: pageCount,
    readPage: readPage,
    finished: finished,
    reading: reading,
    insertedAt: insertedAt,
    updatedAt: updatedAt
  });

  const isSuccess = books.filter((book) => book.id == id).length > 0;

  if (isSuccess) {
    res.status(201).json({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    });
  } else {
    res.status(500).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Buku tidak ada dalam list'
    });
  }
}

async function getAllBooks(req, res) {
  const { name, reading, finished } = req.query;

  let booksData = books;

  if (typeof name !== 'undefined') {
    booksData = booksData.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (typeof reading !== 'undefined') {
    if (reading === '0' || reading === '1') {
      booksData = booksData.filter((book) => book.reading == parseInt(reading));
    } else {
      return res.status(400).json({
        status: 'fail',
        message: "Data buku gagal diambil. Format query parameter 'reading' harus 1 (true) atau 0 (false)"
      });
    }
  }

  if (typeof finished !== 'undefined') {
    if (finished === '0' || finished === '1') {
      booksData = booksData.filter((book) => book.finished == parseInt(finished));
    } else {
      return res.status(400).json({
        status: 'fail',
        message: "Data buku gagal diambil. Format query parameter 'finished' harus 1 (true) atau 0 (false)"
      });
    }
  }


  booksData = booksData.map(({ id, name, publisher }) => ({ id, name, publisher }));

  res.status(200).json({
    status: 'success',
    data: {
      books: booksData
    }
  });
}

async function getBookById(req, res) {
  const id = req.params.id;

  if (typeof id !== 'string') {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal mengambil buku. Tipe data bookId harus string'
    });
  }

  const book = books.filter((book) => book.id == id);

  if (book.length > 0) {
    const data = book[0];
    res.status(200).json({
      status: 'success',
      data: {
        book: {
          id: data.id,
          name: data.name,
          year: data.year,
          author: data.author,
          summary: data.summary,
          publisher: data.publisher,
          pageCount: data.pageCount,
          readPage: data.readPage,
          finished: data.finished,
          reading: data.reading,
          insertedAt: data.insertedAt,
          updatedAt: data.updatedAt
        }
      }
    });
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'Buku tidak ditemukan'
    });
  }
}

async function updateBook(req, res) {
  const id = req.params.id;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = req.body;

  if (!name) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    });
  }

  if (!year || !publisher || !author) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Informasi tahun, penerbit, dan penulis buku tidak boleh kosong'
    });
  }

  if (readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    });
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();

  const bookIndex = books.findIndex((book) => book.id == id);

  console.log(`Books List Before Update: ${books}`);

  if (bookIndex != -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      name: name,
      year: year,
      author: author,
      summary: summary,
      publisher: publisher,
      pageCount: pageCount,
      readPage: readPage,
      finished: finished,
      reading: reading,
      updatedAt: updatedAt,
    };
    console.log(`Books List After Update: ${books}`);
    res.status(200).json({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    });
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
  }
}

async function deleteBook(req, res) {
  const id = req.params.id;

  if (typeof id !== 'string') {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menghapus buku. Tipe data bookId harus string'
    });
  }
  console.log(`Books List Before Delete: ${books}`);

  const bookIndex = books.findIndex((book) => book.id == id);

  if (bookIndex != -1) {
    books.splice(bookIndex, 1);
    console.log(`Books List After Delete: ${books}`);
    const isSuccess = books.findIndex((book) => book.id == id);
    if (isSuccess == -1) {
      res.status(200).json({
        status: 'success',
        message : 'Buku berhasil dihapus'
      });
    } else {
      res.status(404).json({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
      });
    }
  } else {
    res.status(404).json({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
  }

}

module.exports = { addBook, getAllBooks, getBookById, deleteBook, updateBook };