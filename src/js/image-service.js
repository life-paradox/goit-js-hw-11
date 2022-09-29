import Notiflix from 'notiflix';
import axios from 'axios';

const AUTH_KEY = '29767346-edf06844e45d287b086e01957';
const BASE_URL = 'https://pixabay.com/api/';

export class Messages {
  failure() {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  empty() {
    Notiflix.Notify.info('Please, enter something');
  }

  totalCollection(totalHits) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  endOfCollection() {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
const messages = new Messages();

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchData() {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          key: AUTH_KEY,
          q: `${this.searchQuery}`,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: 40,
          page: `${this.page}`,
        },
      });

      if (!response) {
        console.log(response);
        return;
      }

      const data = response.data;

      if (data.total === 0) {
        return messages.failure();
      }
      console.log(this);
      this.incrPage();

      return data;
    } catch (error) {
      console.error(error);
      console.log('error');
    }
  }

  incrPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
