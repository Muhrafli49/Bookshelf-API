/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable key-spacing */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable import/no-dynamic-require */
const { nanoid } = require('nanoid');
const books = require('./books');
// eslint-disable-next-line no-unused-vars

// menyimpan buku
exports.addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (pageCount < readPage) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

// menampilkan seluruh buku
exports.getAllBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (books.length === 0) {
      const response = h.response({
          status: 'success',
          data: {
              books: [],
          },
      });

      response.code(200);
      return response;
  }

  let filterBook = books;

  if (name !== undefined) {
      filterBook = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (reading !== undefined) {
      filterBook = books.filter((book) => Number(book.reading) === Number(reading));
  }
  if (finished !== undefined) {
      filterBook = books.filter((book) => Number(book.finished) === Number(finished));
  }

  const dataBooks = filterBook.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
  }));

  const response = h.response({
      status: 'success',
      data: {
          books: dataBooks,
      },
  });

  response.code(200);
  return response;
};
// menampilkan detail buku

exports.getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const book = books.filter((i) => i.id === bookId)[0];

    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data:{
                book,
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

// mengubah data buku
exports.editBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};
// menghapus buku
exports.deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status:'fail',
        message:'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};