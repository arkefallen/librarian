# 📚 Librarian API

A RESTful API service for managing a book collection library. Built with Express.js and PostgreSQL, this application provides full CRUD operations for book management with comprehensive validation and error handling.

---

## 📋 Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [Add a Book](#1-add-a-book)
  - [Get All Books](#2-get-all-books)
  - [Get Book by ID](#3-get-book-by-id)
  - [Update a Book](#4-update-a-book)
  - [Delete a Book](#5-delete-a-book)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Project Structure](#project-structure)
- [Environment Configuration](#environment-configuration)
- [Contributing](#contributing)
- [License](#license)

---

## 📖 Description

**Librarian** is a lightweight RESTful API designed to manage a book collection. It allows users to perform essential operations such as adding new books, retrieving book information, updating book details, and deleting books from the library. 

The API tracks reading progress for each book, including the number of pages read and whether the book is currently being read or has been finished. It features robust input validation, PostgreSQL database persistence, and follows REST API best practices.

### Key Highlights:
- **Full CRUD Operations** – Create, Read, Update, and Delete books
- **Reading Progress Tracking** – Track pages read and reading status
- **Query Filtering** – Filter books by name, reading status, or completion status
- **Data Validation** – Comprehensive input validation with meaningful error messages
- **PostgreSQL Integration** – Persistent data storage with transaction support

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Add Books** | Add new books to the library with detailed information |
| **List Books** | Retrieve all books with optional filtering by name, reading, or finished status |
| **Get Book Details** | Fetch complete details of a specific book by its ID |
| **Update Books** | Modify existing book information |
| **Delete Books** | Remove books from the library |
| **Reading Progress** | Automatically calculate if a book is finished based on pages read |
| **Query Filtering** | Filter books by name (case-insensitive), reading status, or completion status |
| **Input Validation** | Validates required fields and logical constraints (e.g., readPage ≤ pageCount) |
| **Error Handling** | Comprehensive error responses with descriptive messages |
| **Request Timeout** | 10-second timeout protection for all requests |

---

## 🛠 Tech Stack

### Core Dependencies

| Technology | Version | Purpose |
|------------|---------|---------|
| **[Node.js](https://nodejs.org/)** | v18+ | JavaScript runtime environment |
| **[Express.js](https://expressjs.com/)** | ^5.2.1 | Web application framework for building RESTful APIs |
| **[pg-promise](https://github.com/vitaly-t/pg-promise)** | ^12.3.0 | PostgreSQL interface with promise support |
| **[nanoid](https://github.com/ai/nanoid)** | ^5.1.6 | Unique ID generator for book identifiers |
| **[connect-timeout](https://github.com/expressjs/timeout)** | ^1.9.1 | Request timeout middleware |

### Development Dependencies

| Technology | Version | Purpose |
|------------|---------|---------|
| **[ESLint](https://eslint.org/)** | ^9.39.2 | JavaScript linting tool for code quality |
| **[nodemon](https://nodemon.io/)** | ^3.1.11 | Automatic server restart during development |
| **[eslint-config-dicodingacademy](https://www.npmjs.com/package/eslint-config-dicodingacademy)** | ^0.9.5 | Dicoding Academy ESLint style guide |
| **[globals](https://www.npmjs.com/package/globals)** | ^17.0.0 | Global variables configuration for ESLint |

### Database

| Technology | Purpose |
|------------|---------|
| **[PostgreSQL](https://www.postgresql.org/)** | Primary relational database for data persistence |

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher) – [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** (version 12 or higher) – [Download here](https://www.postgresql.org/download/)

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/arkefallen/librarian.git
cd librarian
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Database Connection

Open `src/controller.js` and update the database connection string to match your PostgreSQL configuration:

```javascript
const db = pgp('postgres://username:password@localhost:5432/librarian');
```

Replace:
- `username` – Your PostgreSQL username (default: `postgres`)
- `password` – Your PostgreSQL password
- `localhost:5432` – Your PostgreSQL host and port
- `librarian` – Your database name

> **💡 Tip:** For production environments, consider using environment variables for database credentials.

---

## 🗄 Database Setup

### 1. Create the Database

Connect to PostgreSQL and create a new database:

```sql
CREATE DATABASE librarian;
```

### 2. Create the Books Table

Connect to the `librarian` database and run the following SQL:

```sql
CREATE TABLE books (
    id VARCHAR(21) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    author VARCHAR(255) NOT NULL,
    summary TEXT,
    publisher VARCHAR(255) NOT NULL,
    pagecount INTEGER NOT NULL DEFAULT 0,
    readpage INTEGER NOT NULL DEFAULT 0,
    finished BOOLEAN NOT NULL DEFAULT FALSE,
    reading BOOLEAN NOT NULL DEFAULT FALSE,
    insertedat TIMESTAMP NOT NULL,
    updatedat TIMESTAMP NOT NULL
);
```

### 3. Create Indexes (Optional but Recommended)

```sql
-- Index for name search
CREATE INDEX idx_books_name ON books (name);

-- Index for filtering queries
CREATE INDEX idx_books_reading ON books (reading);
CREATE INDEX idx_books_finished ON books (finished);
```

---

## 🏃 Running the Application

### Development Mode (with auto-reload)

```bash
npm run start-dev
```

The server will start with automatic restart on file changes, perfect for development.

### Production Mode

```bash
npm start
```

The server will start without auto-reload.

### Default Port

The application runs on **port 9000** by default. Access the API at:

```
http://localhost:9000
```

---

## 📡 API Documentation

### Base URL

```
http://localhost:9000
```

### Response Status

All responses include a `status` field with either:
- `success` – Operation completed successfully
- `fail` – Operation failed (client or server error)

---

### 1. Add a Book

Creates a new book entry in the library.

**Endpoint:** `POST /books`

**Request Body:**

```json
{
  "name": "Harry Potter and the Philosopher's Stone",
  "year": 1997,
  "author": "J.K. Rowling",
  "summary": "A young wizard discovers his magical heritage.",
  "publisher": "Bloomsbury Publishing",
  "pageCount": 309,
  "readPage": 50,
  "reading": true
}
```

**Request Body Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ Yes | The title of the book |
| `year` | integer | ✅ Yes | Publication year |
| `author` | string | ✅ Yes | Author's name |
| `summary` | string | ❌ No | Book summary/description |
| `publisher` | string | ✅ Yes | Publisher's name |
| `pageCount` | integer | ❌ No | Total number of pages |
| `readPage` | integer | ❌ No | Number of pages read (must be ≤ pageCount and ≥ 0) |
| `reading` | boolean | ❌ No | Whether the book is currently being read |

**Success Response (201 Created):**

```json
{
  "status": "success",
  "message": "Buku berhasil ditambahkan",
  "data": {
    "bookId": "V09YExygSUYogwWJ6"
  }
}
```

**Error Responses:**

| Status Code | Condition | Message |
|-------------|-----------|---------|
| 400 | Missing `name` | "Gagal menambahkan buku. Mohon isi nama buku" |
| 400 | Missing `year`, `publisher`, or `author` | "Gagal menambahkan buku. Informasi tahun, penerbit, dan penulis buku tidak boleh kosong" |
| 400 | `readPage` > `pageCount` | "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount" |
| 400 | `readPage` < 0 | "Gagal menambahkan buku. readPage tidak boleh bernilai negatif" |
| 500 | Server error | "Gagal menambahkan buku. Terdapat kesalahan pada server: [error message]" |

---

### 2. Get All Books

Retrieves a list of all books with optional filtering.

**Endpoint:** `GET /books`

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Filter books by name (case-insensitive, partial match) |
| `reading` | 0 \| 1 | Filter by reading status (0 = not reading, 1 = reading) |
| `finished` | 0 \| 1 | Filter by completion status (0 = not finished, 1 = finished) |

**Example Requests:**

```bash
# Get all books
GET /books

# Search by name
GET /books?name=harry

# Filter by reading status
GET /books?reading=1

# Filter by finished status
GET /books?finished=0

# Combine filters
GET /books?name=potter&reading=1&finished=0
```

**Success Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "books": [
      {
        "id": "V09YExygSUYogwWJ6",
        "name": "Harry Potter and the Philosopher's Stone",
        "publisher": "Bloomsbury Publishing"
      },
      {
        "id": "aWZBUW3JN_VBE-9I8",
        "name": "The Lord of the Rings",
        "publisher": "Allen & Unwin"
      }
    ]
  }
}
```

**Error Responses:**

| Status Code | Condition | Message |
|-------------|-----------|---------|
| 400 | Invalid `reading` value | "Data buku gagal diambil. Format query parameter 'reading' harus 1 (true) atau 0 (false)" |
| 400 | Invalid `finished` value | "Data buku gagal diambil. Format query parameter 'finished' harus 1 (true) atau 0 (false)" |
| 500 | Server error | "Data buku gagal diambil. Terdapat kesalahan pada server: [error message]" |

---

### 3. Get Book by ID

Retrieves complete details of a specific book.

**Endpoint:** `GET /books/:id`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The unique identifier of the book |

**Example Request:**

```bash
GET /books/V09YExygSUYogwWJ6
```

**Success Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "book": {
      "id": "V09YExygSUYogwWJ6",
      "name": "Harry Potter and the Philosopher's Stone",
      "year": 1997,
      "author": "J.K. Rowling",
      "summary": "A young wizard discovers his magical heritage.",
      "publisher": "Bloomsbury Publishing",
      "pageCount": 309,
      "readPage": 50,
      "finished": false,
      "reading": true,
      "insertedAt": "2025-01-04T10:30:00.000Z",
      "updatedAt": "2025-01-04T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**

| Status Code | Condition | Message |
|-------------|-----------|---------|
| 400 | Invalid `id` type | "Gagal mengambil buku. Tipe data bookId harus string" |
| 404 | Book not found | "Buku tidak ditemukan" |
| 500 | Server error | "Gagal mengambil buku. Terdapat kesalahan pada server: [error message]" |

---

### 4. Update a Book

Updates an existing book's information.

**Endpoint:** `PUT /books/:id`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The unique identifier of the book |

**Request Body:**

```json
{
  "name": "Harry Potter and the Philosopher's Stone",
  "year": 1997,
  "author": "J.K. Rowling",
  "summary": "Updated summary text",
  "publisher": "Bloomsbury Publishing",
  "pageCount": 309,
  "readPage": 150,
  "reading": true
}
```

**Request Body Fields:** Same as [Add a Book](#1-add-a-book)

**Success Response (200 OK):**

```json
{
  "status": "success",
  "message": "Buku berhasil diperbarui"
}
```

**Error Responses:**

| Status Code | Condition | Message |
|-------------|-----------|---------|
| 400 | Missing `name` | "Gagal memperbarui buku. Mohon isi nama buku" |
| 400 | Missing `year`, `publisher`, or `author` | "Gagal memperbarui buku. Informasi tahun, penerbit, dan penulis buku tidak boleh kosong" |
| 400 | `readPage` > `pageCount` | "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount" |
| 404 | Book not found | "Gagal memperbarui buku. Id tidak ditemukan" |
| 500 | Server error | "Gagal memperbarui buku. Terdapat kesalahan pada server: [error message]" |

---

### 5. Delete a Book

Removes a book from the library.

**Endpoint:** `DELETE /books/:id`

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | The unique identifier of the book |

**Example Request:**

```bash
DELETE /books/V09YExygSUYogwWJ6
```

**Success Response (200 OK):**

```json
{
  "status": "success",
  "message": "Buku berhasil dihapus"
}
```

**Error Responses:**

| Status Code | Condition | Message |
|-------------|-----------|---------|
| 400 | Invalid `id` type | "Gagal menghapus buku. Tipe data bookId harus string" |
| 404 | Book not found | "Buku gagal dihapus. Id tidak ditemukan" |
| 500 | Server error | "Gagal menghapus buku. Terdapat kesalahan pada server: [error message]" |

---

## 📋 Response Format

### Success Response Structure

```json
{
  "status": "success",
  "message": "Operation message (optional)",
  "data": {
    // Response data (optional)
  }
}
```

### Error Response Structure

```json
{
  "status": "fail",
  "message": "Error description"
}
```

---

## ⚠️ Error Handling

The API provides comprehensive error handling with the following HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| **200** | OK – Request succeeded |
| **201** | Created – New resource created successfully |
| **400** | Bad Request – Invalid input or validation error |
| **404** | Not Found – Requested resource does not exist |
| **500** | Internal Server Error – Server-side error |

All error responses include descriptive messages in Indonesian to help identify the issue.

---

## 📁 Project Structure

```
librarian/
├── src/
│   ├── app.js              # Application entry point & Express configuration
│   └── controller.js       # Route handlers & business logic
├── node_modules/           # Dependencies
├── .gitignore              # Git ignore configuration
├── eslint.config.mjs       # ESLint configuration
├── package.json            # Project metadata & dependencies
├── package-lock.json       # Dependency lock file
└── README.md               # Project documentation
```

### File Descriptions

| File | Description |
|------|-------------|
| `src/app.js` | Express application setup, middleware configuration, and route definitions |
| `src/controller.js` | Contains all controller functions for handling book CRUD operations and database interactions |
| `eslint.config.mjs` | ESLint configuration following Dicoding Academy style guide |

---

## ⚙️ Environment Configuration

### Current Configuration (Default)

The application uses hardcoded configuration in the codebase:

- **Port:** 9000
- **Database:** PostgreSQL at `localhost:5432/librarian`
- **Timeout:** 10 seconds

### Recommended: Using Environment Variables

For production deployment, consider migrating to environment variables:

```bash
# .env file example
PORT=9000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=librarian
DB_USER=postgres
DB_PASSWORD=your_password
REQUEST_TIMEOUT=10s
```

---

## 🧪 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `start-dev` | `npm run start-dev` | Starts the server with nodemon for development |
| `start` | `npm start` | Starts the server for production |
| `lint` | `npm run lint` | Runs ESLint to check code quality |

---

## 🧩 Book Data Model

### Book Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (21 chars) | Unique identifier (generated with nanoid) |
| `name` | string | Book title |
| `year` | integer | Publication year |
| `author` | string | Author's name |
| `summary` | string \| null | Book summary/description |
| `publisher` | string | Publisher's name |
| `pageCount` | integer | Total number of pages |
| `readPage` | integer | Number of pages read |
| `finished` | boolean | Whether the book is finished (auto-calculated: `readPage === pageCount`) |
| `reading` | boolean | Whether the book is currently being read |
| `insertedAt` | string (ISO 8601) | Creation timestamp |
| `updatedAt` | string (ISO 8601) | Last update timestamp |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

This project uses ESLint with the Dicoding Academy style guide. Before committing, run:

```bash
npm run lint
```

---

## 📜 License

This project is licensed under the **ISC License**.

---

<div align="center">

**Made with ❤️ by [Librarian Team](https://github.com/arkefallen)**

</div>
