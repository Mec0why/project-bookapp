/* global Handlebars, utils, dataSource */ // eslint-disable-line

{
  ('use strict');

  const select = {
    templateOf: {
      book: '#template-book',
    },
    book: {
      header: '.book__header',
      coverImage: '.book__image',
      ratings: '.book__rating',
    },
    containerOf: {
      books: '.books-list',
      filters: '.filters',
    },
    element: {
      dataId: 'data-id',
    },
  };

  const settings = {
    amountRating: {
      defaultValue: 1,
    },
  };

  const classNames = {
    favoriteBook: 'favorite',
    hidden: 'hidden',
  };

  const templates = {
    book: Handlebars.compile(
      document.querySelector(select.templateOf.book).innerHTML
    ),
  };

  const favoriteBooksList = [];
  const filters = [];

  class Book {
    constructor(id, data) {
      const thisBook = this;

      thisBook.id = id;
      thisBook.data = data;

      thisBook.renderInMenu();
      thisBook.getElements();
      thisBook.initActions();
    }

    renderInMenu() {
      const thisBook = this;

      const generatedHTML = templates.book(thisBook.data);

      thisBook.element = utils.createDOMFromHTML(generatedHTML);

      const booksContainer = document.querySelector(select.containerOf.books);

      booksContainer.appendChild(thisBook.element);
    }

    getElements() {
      const thisBook = this;

      thisBook.bookFavorite = thisBook.element.querySelector(
        select.book.coverImage
      );

      thisBook.filters = document.querySelector(select.containerOf.filters);
    }

    initActions() {
      const thisBook = this;

      thisBook.bookFavorite.addEventListener('click', function (event) {
        event.preventDefault();
      });

      thisBook.bookFavorite.addEventListener('dblclick', function (event) {
        event.preventDefault();

        const book = event.target.offsetParent;
        book.classList.toggle(classNames.favoriteBook);

        const dataId = thisBook.data.id;

        if (book.classList.value.includes(classNames.favoriteBook)) {
          favoriteBooksList.push(dataId);
          //console.log(favoriteBooksList);
        } else {
          const removeDataId = favoriteBooksList.indexOf(dataId);
          favoriteBooksList.splice(removeDataId, 1);
          //console.log(favoriteBooksList);
        }
      });

      thisBook.filters.addEventListener('click', function (event) {
        const filter = event.target;
        console.log(filter);
        if (
          filter.getAttribute('type') === 'checkbox' &&
          filter.getAttribute('name') === 'filter'
        ) {
          if (filter.checked) {
            filters.push(filter.value);
            thisBook.filterBooks();
          } else if (!filter.checked) {
            const filterId = filters.indexOf(filter.value);
            filters.splice(filterId, 1);
            thisBook.filterBooks();
          }
        }
      });
    }

    filterBooks() {
      const books = dataSource.books;
      const bookList = [];

      for (let book of books) {
        for (const filter of filters) {
          if (!book.details[filter]) {
            bookList.push(book.id);
          }
        }

        if (bookList.includes(book.id)) {
          const bookImage = document.querySelector(
            '[data-id="' + book.id + '"]'
          );
          bookImage.classList.add(classNames.hidden);
        } else if (!bookList.includes(book.id)) {
          const bookImage = document.querySelector(
            '[data-id="' + book.id + '"]'
          );
          bookImage.classList.remove(classNames.hidden);
        }
      }
    }
  }

  const app = {
    initBook: function () {
      const thisApp = this;

      for (let bookData in thisApp.data.books) {
        new Book(thisApp.data.books[bookData].id, thisApp.data.books[bookData]);
      }
    },

    initData: function () {
      const thisApp = this;
      thisApp.data = dataSource;
      thisApp.initBook();
    },

    init: function () {
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('settings:', settings);
      console.log('templates:', templates);

      thisApp.initData();
    },
  };

  app.init();
}
