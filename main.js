document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
  const API_KEY = '464e10b60abead2a4d80d7babcfba4a2';

  const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowsList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal');

  // Обращение к базе данных с помощью класса и асинхронной функции asynс - await

  class DBService {
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
        vote_average: vote
      } = item;

      const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
      const backdropIMG = '';
      const voteElem = '';

      const card = document.createElement('li');
      card.className = 'tv-shows__item';
      card.innerHTML = `
        <a href="#" class="tv-card">
          <span class="tv-card__vote">${vote}</span>
          <img class="tv-card__img"
            src="${posterIMG}"
            data-backdrop="${IMG_URL + backdrop}"
            alt="${title}">
          <h4 class="tv-card__head">${title}</h4>
        </a>
      `;

      tvShowsList.append(card);
    });
  };

  new DBService().getTestData().then(renderCard);

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
      document.body.style.overflow = 'hidden';
      modal.classList.remove('hide');
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