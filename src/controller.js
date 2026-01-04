const { nanoid } = require('nanoid');
const pgp = require('pg-promise')({
    connect(e) {
        const cp = e.client.connectionParameters;
        console.log('Connected to DB', cp.database);
    }
});
const db = pgp('postgres://postgres:root@localhost:5432/librarian');

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
            status: "fail",
            message: "Gagal menambahkan buku. Mohon isi nama buku"
        });
    }

    if (!year || !publisher || !author) {
        return res.status(400).json({
            status: "fail",
            message: "Gagal menambahkan buku. Informasi tahun, penerbit, dan penulis buku tidak boleh kosong"
        });
    }

    if (readPage > pageCount) {
        return res.status(400).json({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
        });
    }

    if (readPage < 0) {
        return res.status(400).json({
            status: "fail",
            message: "Gagal menambahkan buku. readPage tidak boleh bernilai negatif"
        });
    }

    const id = nanoid();
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    // DB Transaction
    return await db.tx(async trx => {
        return await trx.one(`INSERT INTO books (id, name, year, author, summary, publisher, pagecount, readpage, finished, reading, insertedat, updatedat) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
            [id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt]);
    }).then(data => {
        res.status(201).json({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: data
            }
        });
    }).catch(error => {
        res.status(500).json({
            status: "fail",
            message: `Gagal menambahkan buku. Terdapat kesalahan pada server: ${error.message}`
        });
    });
}

async function getAllBooks(req, res) {
    const { name, reading, finished } = req.query;

    // Build WHERE clauses only for provided query params
    const conditions = [];
    const values = [];

    if (typeof name !== 'undefined') {
        values.push(`%${name}%`);
        conditions.push(`name ILIKE $${values.length}`);
    }

    if (typeof reading !== 'undefined') {
        if (typeof reading === 'number' && (reading == 0 || reading == 1)) {
            values.push(reading);
            conditions.push(`reading = $${values.length}`);
        } else {
            return res.status(400).json({
                status: "fail",
                message: "Data buku gagal diambil. Format query parameter 'reading' harus 1 (true) atau 0 (false)"
            });
        }
    }

    if (typeof finished !== 'undefined') {
        if (typeof finished === 'number' && (finished == 0 || finished == 1)) {
            values.push(finished);
            conditions.push(`finished = $${values.length}`);
        } else {
            return res.status(400).json({
                status: "fail",
                message: "Data buku gagal diambil. Format query parameter 'finished' harus 1 (true) atau 0 (false)"
            });
        }
    }

    const sql = `SELECT * FROM books${conditions.length ? ' WHERE ' + conditions.join(' AND ') : ''}`;

    return await db.any(sql, values)
        .then(data => {
            res.status(200).json({
                status: "success",
                data: {
                    books: data
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                status: "fail",
                message: `Data buku gagal diambil. Terdapat kesalahan pada server: ${error}`
            });
        });
}

async function getBookById(req, res) {
    const id = req.params.id;

    if (typeof id !== 'string') {
        return res.status(400).json({
            status: "fail",
            message: "Gagal mengambil buku. Tipe data bookId harus string"
        });
    }

    return await db.result('SELECT * from books WHERE id = $1 LIMIT 1', [id])
        .then(result => {
            if (result.rowCount > 0) {
                return res.status(200).json({
                    status: "success",
                    data: {
                        book: result.rows[0]
                    }
                });
            } else {
                return res.status(404).json({
                    status: "fail",
                    message: "Buku tidak ditemukan"
                });
            }
        })
        .catch(error => {
            return res.status(500).json({
                status: "fail",
                message: `Gagal mengambil buku. Terdapat kesalahan pada server: ${error}`
            });
        });
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
            status: "fail",
            message: "Gagal memperbarui buku. Mohon isi nama buku"
        });
    }

    if (!year || !publisher || !author) {
        return res.status(400).json({
            status: "fail",
            message: "Gagal memperbarui buku. Informasi tahun, penerbit, dan penulis buku tidak boleh kosong"
        });
    }

    if (readPage > pageCount) {
        return res.status(400).json({
            status: "fail",
            message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
        });
    }

    const finished = pageCount === readPage;
    const updatedAt = new Date().toISOString();

    return await db.tx(async trx => {
        return await trx.none(`UPDATE books SET name = $1, year = $2, author = $3, summary = $4, publisher = $5, pageCount = $6, readPage = $7, finished = $8, reading = $9, updatedAt = $10 WHERE id = $11`,
            [name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt, id]);
    }).then(() => {
        res.status(200).json({
            status: "success",
            message: "Buku berhasil diperbarui"
        });
    }).catch(error => {
        if (error.received == 0) {
            return res.status(404).json({
                status: "fail",
                message: "Gagal memperbarui buku. Id tidak ditemukan"
            });
        }
        res.status(500).json({
            status: "fail",
            message: `Gagal memperbarui buku. Terdapat kesalahan pada server: ${error.message}`
        });
    });    
}

async function deleteBook(req, res) {
    const id = req.params.id;

    if (typeof id !== 'string') {
        return res.status(400).json({
            status: "fail",
            message: "Gagal menghapus buku. Tipe data bookId harus string"
        });
    }

    return await db.result(`DELETE FROM books WHERE id = $1`, id)
    .then(result => {
        if (result.rowCount > 0) {
            return res.status(200).json({
                status: "success",
                message : "Buku berhasil dihapus"
            });   
        } else {
            return res.status(404).json({
                status: "fail",
                message: "Buku gagal dihapus. Id tidak ditemukan"
            });
        }
    })
    .catch(error => {
        return res.status(500).json({
            status: "fail",
            message: `Gagal menghapus buku. Terdapat kesalahan pada server: ${error}`
        });
    });
}

module.exports = { addBook, getAllBooks, getBookById, deleteBook, updateBook };