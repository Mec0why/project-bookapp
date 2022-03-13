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
      book: '.books-list',
    },
  };

  const settings = {
    amountRating: {
      defaultValue: 1,
    },
  };

  const classNames = {
    favouriteBook: 'favorite',
  };

  const templates = {
    book: Handlebars.compile(
      document.querySelector(select.templateOf.book).innerHTML
    ),
  };

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

      const bookContainer = document.querySelector(select.containerOf.book);

      bookContainer.appendChild(thisBook.element);
    }

    getElements() {
      const thisBook = this;

      thisBook.bookFavourite = thisBook.element.querySelector(
        select.book.coverImage
      );
    }

    initActions() {
      const thisBook = this;

      thisBook.element.addEventListener('dblclick', function (event) {
        event.preventDefault();

        thisBook.bookFavourite.classList.toggle(classNames.favouriteBook);
      });
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
