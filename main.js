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
    searchFormInput = document.querySelector('.search__form-input'),
    preloader = document.querySelector('.preloader'),
    dropdown = document.querySelectorAll('.dropdown'),
    tvShowsHead = document.querySelector('.tv-shows__head'),
    posterWrapper = document.querySelector('.poster__wrapper'),
    modalContent = document.querySelector('.modal__content'),
    pagination = document.querySelector('.pagination');

  // Создание и реализация прелоудера при загрузке сайта

  const loading = document.createElement('div');
  loading.className = 'loading';

  // Обращение к базе данных с помощью класса и асинхронной функции asynс - await
  class DBService {

    constructor() {
      this.SERVER = 'https://api.themoviedb.org/3';
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
    };

    // Возврат всех страниц запрошенного в поиске

    getSearchResult = query => {
      this.temp = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&query=${query}`;
      return this.getData(this.temp);
    }

    getNextPage = page => {
      return this.getData(this.temp + '&page=' + page);
    }

    getTvShow = id => this
      .getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);

    getTopRated = () => this
      .getData(`${this.SERVER}/tv/top_rated?api_key=${this.API_KEY}&language=ru-RU`);

    getPopular = () => this
      .getData(`${this.SERVER}/tv/popular?api_key=${this.API_KEY}&language=ru-RU`);

    getToday = () => this
      .getData(`${this.SERVER}/tv/airing_today?api_key=${this.API_KEY}&language=ru-RU`);

    getWeek = () => this
      .getData(`${this.SERVER}/tv/on_the_air?api_key=${this.API_KEY}&language=ru-RU`);
  }
  const dbService = new DBService();

  // Рендеринг полученных данных и создание карточек

  const renderCard = (response, target) => {
    tvShowsList.textContent = '';

    // Если по поиску ничего не найдено

    if (!response.total_results) {
      loading.remove();
      tvShowsHead.textContent = 'К сожалению, по Вашему запросу ничего не найдено...';
      tvShowsHead.style.color = 'red';
      return;
    }
    tvShowsHead.textContent = target ? target.textContent : 'Результат поиска:';
    tvShowsHead.style.color = 'black';


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

    // Пагинация полученных данных

    pagination.textContent = '';
    if (!target && response.total_pages > 1) {
      for (let i = 1; i <= response.total_pages; i++) {
        pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
      }
    }
  };

  pagination.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    if (target.classList.contains('pages')) {
      tvShows.append(loading);
      dbService.getNextPage(target.textContent).then(renderCard);
    }
  });

  // Реализация поиска

  searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();

    if (value) {
      tvShows.append(loading);
      dbService.getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';
  });

  // Открытие-закрытие меню

  const closeDropdown = () => {
    dropdown.forEach(item => {
      item.classList.remove('active');
    })
  };
  hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
    closeDropdown();
  });

  // Закрытие меню при клике вне меню

  document.addEventListener('click', event => {
    const target = event.target;
    if (!target.closest('.left-menu')) {
      leftMenu.classList.remove('openMenu');
      hamburger.classList.remove('open');
      closeDropdown();
    }
  });

  // Открытие вложенного меню, реализация функций вложенного меню

  leftMenu.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const dropdown = event.target.closest('.dropdown');
    if (dropdown) {
      dropdown.classList.toggle('active');
      leftMenu.classList.add('openMenu');
      hamburger.classList.add('open');
    }

    if (target.closest('#top-rated')) {
      tvShows.append(loading);
      dbService.getTopRated().then((response) => renderCard(response, target));
      leftMenu.classList.remove('openMenu');
      hamburger.classList.remove('open');
    }

    if (target.closest('#popular')) {
      tvShows.append(loading);
      dbService.getPopular().then((response) => renderCard(response, target));
      leftMenu.classList.remove('openMenu');
      hamburger.classList.remove('open');
    }

    if (target.closest('#today')) {
      tvShows.append(loading);
      dbService.getToday().then((response) => renderCard(response, target));
      leftMenu.classList.remove('openMenu');
      hamburger.classList.remove('open');
    }

    if (target.closest('#week')) {
      tvShows.append(loading);
      dbService.getWeek().then((response) => renderCard(response, target));
      leftMenu.classList.remove('openMenu');
      hamburger.classList.remove('open');
    }

    if (target.closest('#search')) {
      tvShowsList.textContent = '';
      tvShowsHead.textContent = '';
      leftMenu.classList.remove('openMenu');
      hamburger.classList.remove('open');
    }
  });

  // Открытие модального окна

  tvShowsList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const card = target.closest('.tv-card');
    if (card) {

      // Прелоудер перед загрузкой модального окна

      preloader.style.display = 'block';

      // Заполнение модального окна

      dbService.getTvShow(card.id)

        // Деструктуризация

        .then(({
          poster_path: posterPath,
          name: title,
          genres,
          vote_average: voteAverage,
          overview,
          homepage
        }) => {

          // Изменение модального окна при отсутствии постера

          if (posterPath) {
            tvCardImg.src = IMG_URL + posterPath;
            tvCardImg.alt = title;
            posterWrapper.style.display = '';
            modalContent.style.paddingLeft = '';
          } else {
            posterWrapper.style.display = 'none';
            modalContent.style.paddingLeft = '25px';
          }

          modalTitle.textContent = title;

          // Реализация через метод .reduce()
          // genresList.innerHTML = data.genres.reduce((acc, item) => `${acc}<li>${item.name}</li>`, '');

          //Реализация через цикл for of (быстрее, чем forEach)
          // genresList.textContent = '';
          // for (const item of data.genres) {
          //   genresList.innerHTML += `<li>${item.name}</li>`;
          // }

          // Реализация через метод .forEach()

          genresList.textContent = '';
          genres.forEach(item => {
            genresList.innerHTML += `<li>${item.name}</li>`;
          });

          rating.textContent = voteAverage;
          description.textContent = overview;
          modalLink.href = homepage;
        })

        .then(() => {
          document.body.style.overflow = 'hidden';
          modal.classList.remove('hide');
        })

        .finally(() => {
          preloader.style.display = '';
        });
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