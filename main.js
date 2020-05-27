document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

  const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    tvShows = document.querySelector('.tv-shows'),
    tvCardImg = document.querySelector('.tv-card__img'),
    modalTitle = document.querySelector('.modal__title'),
    genresList = document.querySelector('.genres-list'),
    rating = document.querySelector('.rating'),
    description = document.querySelector('.description'),
    modalLink = document.querySelector('.modal__link'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input');

  // Создание и реализация прелоудера при загрузке сайта
  const loading = document.createElement('div');
  loading.className = 'loading';

  // Обращение к базе данных с помощью класса и асинхронной функции asynс - await

  class DBService {

    constructor() {
      this.SERVER = 'https://api.themoviedb.org/3'

      this.API_KEY = '464e10b60abead2a4d80d7babcfba4a2';

    }
    getData = async (url) => {
      const res = await fetch(url);
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(`Не удалось получить данные по адресу ${url}`);
      }
    };

    getTestData = () => {
      return this.getData('test.json');
    };

    getTestCard = () => {
      return this.getData('card.json');
    }

    getSearchResult = query => this
      .getData(`${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`);

    getTvShow = id => this
      .getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
  }

  // Рендеринг полученных данных и создание карточек
  const renderCard = response => {
    tvShowsList.textContent = '';

    response.results.forEach(item => {

      // Деструктуризация полученных данных
      const {
        backdrop_path: backdrop,
        name: title,
        poster_path: poster,
        vote_average: vote,
        id
      } = item;

      const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg'; // Проверка на наличие постера
      const backdropIMG = backdrop ? IMG_URL + backdrop : ''; // Проверка на наличие замещающей картинки
      const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : ''; // Проверка на наличие оценки в баллах

      const card = document.createElement('li');
      card.className = 'tv-shows__item';
      card.innerHTML = `
        <a href="#" id="${id}" class="tv-card">
            ${voteElem}          
            <img class="tv-card__img"
            src="${posterIMG}"
            data-backdrop="${backdropIMG}"
            alt="${title}">
          <h4 class="tv-card__head">${title}</h4>
        </a>
      `;

      loading.remove();
      tvShowsList.append(card);
    });
  };

  // Реализация поиска
  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();

    if (value) {
      tvShows.append(loading);
      new DBService().getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';
  });

  // Открытие-закрытие меню
  hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
  });

  // Закрытие меню при клике вне меню
  document.addEventListener('click', event => {
    const target = event.target;
    if (!target.closest('.left-menu')) {
      leftMenu.classList.remove('openMenu');
      hamburger.classList.remove('open');
    }
  });

  // Открытие вложенного меню
  leftMenu.addEventListener('click', event => {
    event.preventDefault();
    const dropdown = event.target.closest('.dropdown');
    if (dropdown) {
      dropdown.classList.toggle('active');
      leftMenu.classList.add('openMenu');
      hamburger.classList.add('open');
    }
  });

  // Открытие модального окна
  tvShowsList.addEventListener('click', event => {
    event.preventDefault();
    const card = event.target.closest('.tv-card');
    if (card) {

      // Заполнение модального окна
      new DBService().getTvShow(card.id)
        .then(data => {
          tvCardImg.src = IMG_URL + data.poster_path;
          modalTitle.textContent = data.name;

          // Реализация через метод .reduce()
          // genresList.innerHTML = data.genres.reduce((acc, item) => `${acc}<li>${item.name}</li>`, '');

          //Реализация через цикл for of (быстрее, чем forEach)
          // genresList.textContent = '';
          // for (const item of data.genres) {
          //   genresList.innerHTML += `<li>${item.name}</li>`;
          // }

          // Реализация через метод .forEach()
          genresList.textContent = '';
          data.genres.forEach(item => {
            genresList.innerHTML += `<li>${item.name}</li>`;
          });

          rating.textContent = data.vote_average;
          description.textContent = data.overview;
          modalLink.href = data.homepage;

        })
        .then(() => {
          document.body.style.overflow = 'hidden';
          modal.classList.remove('hide');
        })
    }
  });

  // Закрытие модального окна по нажатию на крестик или на поле вокруг модального окна
  modal.addEventListener('click', event => {
    const target = event.target;
    if (target.closest('.cross') ||
      target.classList.contains('modal')) {
      document.body.style.overflow = '';
      modal.classList.add('hide');
    }
  });

  // Изменение картинки при наведении на нее мыши
  const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');
    if (card) {
      const img = card.querySelector('.tv-card__img');

      // Деструктуризация 

      if (img.dataset.backdrop) {
        [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src]
      }
    }
  };

  tvShowsList.addEventListener('mouseover', changeImage)
  tvShowsList.addEventListener('mouseout', changeImage)



});

// Полезная ссылка https://jsonplaceholder.typicode.com/