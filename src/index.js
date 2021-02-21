import './sass/styles.scss';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/Material.css';
import 'material-design-icons/iconfont/material-icons.css';
require('typeface-roboto');
require('basiclightbox/dist/basicLightbox.min.css');
import { error, success } from '@pnotify/core/dist/PNotify.js';
const { defaults } = require('@pnotify/core');
defaults.styling = 'material';
defaults.icons = 'material';
defaults.mode = 'light';
defaults.delay = '1500';
import * as basicLightbox from 'basiclightbox';
import * as apiService from './js/apiService.js';
import imageCard from '../src/templates/image-card.hbs';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.js-btn-load-more'),
  userQuery: document.querySelector('[name="query"]'),
};

function scrollToEnd() {
  setTimeout(() => {
    window.scrollTo({
      top: document.documentElement.offsetHeight - 900,
      behavior: 'smooth',
    });
  }, 300);
}

function renderMarkup({ hits, totalHits }) {
  if (totalHits === 0 || refs.userQuery.value === '') {
    return error({
      title: 'Oops...',
      text: `Can\'t find images with such tag`,
    });
  }
  success({
    text: 'Matches found!',
  });
  const markup = imageCard(hits);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  refs.btnLoadMore.classList.remove('is-hidden');
}

function resetSearch() {
  refs.userQuery.value = '';
  refs.btnLoadMore.classList.add('is-hidden');
  refs.gallery.innerHTML = '';
  apiService.api.page = 1;
}

function renderMore() {
  apiService.api.page += 1;
  apiService
    .fetchImages(refs.userQuery.value, apiService.api.page)
    .then(({ hits }) => {
      const markup = imageCard(hits);
      refs.gallery.insertAdjacentHTML('beforeend', markup);
      scrollToEnd();
    });
}

function modalHandler() {
  const instance = basicLightbox.create(`
    <div class="modal">
    <img src="${event.target.dataset.source}">
    </div>
`);
  instance.show();
}

refs.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  apiService.api.page = 1;
  refs.btnLoadMore.classList.add('is-hidden');
  apiService
    .fetchImages(refs.userQuery.value)
    .then(renderMarkup)
    .catch(console.log);
});

refs.searchForm.addEventListener('click', e => {
  if (e.target.dataset.action === 'clear') {
    resetSearch();
  }
});

refs.btnLoadMore.addEventListener('click', renderMore);

refs.gallery.addEventListener('click', modalHandler);
