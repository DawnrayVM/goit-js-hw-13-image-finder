import './sass/styles.scss';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/Material.css';
import 'material-design-icons/iconfont/material-icons.css';
require('typeface-roboto');
import { notice, error, success } from '@pnotify/core/dist/PNotify.js';
const { defaults } = require('@pnotify/core');
defaults.styling = 'material';
defaults.icons = 'material';
defaults.mode = 'light';
defaults.delay = '1500';
const debounce = require('lodash.debounce');
import * as apiService from './js/apiService.js';
import imageCard from '../src/templates/image-card.hbs';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.js-btn-load-more'),
};

function scrollToEnd() {
  const scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight,
  );
  setTimeout(() => {
    window.scrollTo({
      top: scrollHeight,
      behavior: 'smooth',
    });
  }, 350);
}

function resetSearch() {
  userQuery.value = '';
  refs.btnLoadMore.classList.add('is-hidden');
  refs.gallery.innerHTML = '';
  apiService.api.page = 1;
}
function loadMore(userQuery) {
  apiService.api.page += 1;
  apiService.fetchImages(userQuery, apiService.api.page).then(({ hits }) => {
    success({
      text: 'Matches found!',
    });
    const markUp = imageCard(hits);
    refs.gallery.insertAdjacentHTML('beforeend', markUp);
  });
  scrollToEnd();
}
const userQuery = document.querySelector('[name="query"]');

refs.searchForm.addEventListener('submit', event => {
  event.preventDefault();
  apiService
    .fetchImages(userQuery.value, (apiService.api.page += 1))
    .then(({ hits, totalHits }) => {
      if (totalHits === 0 || userQuery.value === '') {
        return error({
          title: 'Oops...',
          text: `Can\'t find images with such tag`,
        });
      }
      success({
        text: 'Matches found!',
      });
      const markUp = imageCard(hits);
      refs.gallery.insertAdjacentHTML('beforeend', markUp);
      refs.btnLoadMore.classList.remove('is-hidden');
    });
  scrollToEnd();
});

refs.btnLoadMore.addEventListener('click', e => {
  loadMore(userQuery.value);
});

refs.searchForm.addEventListener('click', e => {
  if (e.target.dataset.action === 'clear') {
    resetSearch();
  }
});
