// const apiKey = '20341451-3d1090cbc297b1fd4b3b8fcd1'; { webformatURL, likes, views, comments, downloads }
// const apiUrl = `https://pixabay.com/api/?key=${apiKey}&image_type=photo&orientation=horizontal&q=`;

export const api = {
  url: 'https://pixabay.com/api/',
  imageType: 'image_type=photo',
  imageOrientation: 'orientation=horizontal',
  page: 1,
  perPage: 'per_page=12',
  key: 'key=20341451-3d1090cbc297b1fd4b3b8fcd1',
};

export function fetchImages(query, page = api.page) {
  return fetch(
    `${api.url}?${api.key}&${api.imageType}&${api.imageOrientation}&page=${page}&${api.perPage}&q=${query}`,
  ).then(res => res.json());
}
