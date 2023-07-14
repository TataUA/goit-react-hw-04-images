import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { fetchImages } from 'services/API';
import { Container, Err } from './App.styled';

export const App = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (query === '') {
      return;
    }
    async function findImages() {
      try {
        const response = await fetchImages(query, page);
        const images = response.hits.map(
          ({ id, webformatURL, largeImageURL, tags }) => ({
            id,
            webformatURL,
            largeImageURL,
            tags,
          })
        );
        setGallery(prevState => [...prevState, ...images]);
        setTotalHits(response.totalHits);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    setLoading(true);
    findImages();
  }, [query, page]);

  const handleChange = value => {
    if (value === '') {
      alert('You need write something...');
      return;
    }
    setQuery(value.toLowerCase());
    setGallery([]);
    setPage(1);
  };

  const onLoadMoreBtn = () => setPage(prevState => prevState + 1);

  const toggleModal = (image = null) => {
    setModal(image);
  };

  return (
    <Container>
      <Searchbar onSubmit={handleChange} />
      {loading && <Loader />}
      <ImageGallery images={gallery} onOpenModal={toggleModal} />

      {gallery.length > 0 && gallery.length < totalHits && (
        <Button onLoadMore={onLoadMoreBtn} />
      )}
      {modal && <Modal largeImage={modal} onCloseModal={toggleModal} />}
      {error && <Err>Something went wrong... &#128576;</Err>}
    </Container>
  );
};
