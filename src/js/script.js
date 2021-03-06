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

  const classNames = {
    favoriteBook: 'favorite',
    hidden: 'hidden',
  };

  const templates = {
    book: Handlebars.compile(
      document.querySelector(select.templateOf.book).innerHTML
    ),
  };

  class BookList {
    constructor() {
      const thisBook = this;

      thisBook.filters = [];
      thisBook.initData();
      thisBook.getElements();
      thisBook.determineRatingBgc();
      thisBook.initActions();
    }

    initData() {
      const thisBook = this;

      thisBook.data = dataSource.books;

      for (let book of thisBook.data) {
        const thisBook = this;
        book.ratingBgc = thisBook.determineRatingBgc(book.rating);
        book.ratingWidth = book.rating * 10;

        const generatedHTML = templates.book(book);

        thisBook.element = utils.createDOMFromHTML(generatedHTML);

        const bookContainer = document.querySelector(select.containerOf.books);

        bookContainer.appendChild(thisBook.element);
      }
    }

    getElements() {
      const thisBook = this;

      thisBook.container = document.querySelector(select.containerOf.books);

      thisBook.bookFavorite = thisBook.element.querySelector(
        select.book.coverImage
      );

      thisBook.dom = {};

      thisBook.dom.filters = document.querySelector(select.containerOf.filters);
    }

    initActions() {
      const thisBook = this;

      const favoriteBooksList = [];

      thisBook.container.addEventListener('click', function (event) {
        event.preventDefault();
      });

      thisBook.container.addEventListener('dblclick', function (event) {
        event.preventDefault();

        const clickBook = event.target.offsetParent;
        clickBook.classList.toggle(classNames.favoriteBook);

        const dataId = clickBook.dataset.id;

        if (clickBook.classList.value.includes(classNames.favoriteBook)) {
          favoriteBooksList.push(dataId);
          console.log(favoriteBooksList);
        } else {
          const removeDataId = favoriteBooksList.indexOf(dataId);
          favoriteBooksList.splice(removeDataId, 1);
          console.log(favoriteBooksList);
        }
      });

      thisBook.dom.filters.addEventListener('click', function (event) {
        const filter = event.target;

        console.log(filter);
        if (
          filter.getAttribute('type') === 'checkbox' &&
          filter.getAttribute('name') === 'filter'
        ) {
          if (filter.checked) {
            thisBook.filters.push(filter.value);
          } else if (!filter.checked) {
            const filterId = thisBook.filters.indexOf(filter.value);
            thisBook.filters.splice(filterId, 1);
          }
          thisBook.filterBooks();
        }
      });
    }

    filterBooks() {
      const thisBook = this;
      const books = dataSource.books;
      const bookList = [];

      for (let book of books) {
        for (const filter of thisBook.filters) {
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

    determineRatingBgc(rating) {
      let ratingBgc = '';

      if (rating < 6) {
        ratingBgc = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8) {
        ratingBgc = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9) {
        ratingBgc = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if (rating > 9) {
        ratingBgc = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
      return ratingBgc;
    }
  }

  const app = new BookList();
  console.log(app);
}
