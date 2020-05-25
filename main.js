document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger');

  // Открытие-закрытие меню
  hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');

  });

  // Закрытие меню при клике вне меню
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target.closest('.left-menu')) {
      leftMenu.classList.remove('openMenu');
      hamburger.classList.remove('open');
    }
  });

  // Открытие вложенного меню
  leftMenu.addEventListener('click', (event) => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
      dropdown.classList.toggle('active');
      leftMenu.classList.add('openMenu');
      hamburger.classList.add('open');
    }
  });





});