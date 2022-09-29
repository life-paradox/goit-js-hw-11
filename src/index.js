import './css/styles.css';
import { Messages } from './js/image-service';
import ImagesApiService from './js/image-service';
import renderCards from './js/card-render';
import LoadMoreBtn from './js/load-more-btn';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
};

const imageApiService = new ImagesApiService();
const messages = new Messages();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.form.addEventListener('submit', onSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

const simpleGallery = new SimpleLightbox('.gallery a', {});

function clearPage() {
  refs.galleryEl.innerHTML = '';
}

function appendCardsMarkup(hits) {
  refs.galleryEl.insertAdjacentHTML('beforeend', renderCards(hits));
  checkCollection;
  simpleGallery.refresh();
}

async function onSubmit(e) {
  e.preventDefault();
  clearPage();

  imageApiService.query = e.currentTarget.elements.searchQuery.value;

  if (imageApiService.query === '') {
    return messages.empty();
  }

  imageApiService.resetPage();

  try {
    loadMoreBtn.show();
    loadMoreBtn.disable();

    const data = await imageApiService.fetchData();
    checkCollection(data);

    messages.totalCollection(data.totalHits);

    appendCardsMarkup(data.hits);
    loadMoreBtn.enable();
  } catch (error) {
    loadMoreBtn.hide();
  }
}

async function onLoadMore(e) {
  e.preventDefault();

  loadMoreBtn.disable();
  const data = await imageApiService.fetchData();
  checkCollection(data);
  appendCardsMarkup(data.hits);

  loadMoreBtn.enable();
}

function checkCollection(data) {
  if (data.hits.length < 40) {
    messages.endOfCollection();
    loadMoreBtn.hide();
    return;
  }
}
