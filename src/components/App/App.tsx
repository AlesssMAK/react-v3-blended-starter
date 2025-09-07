import Section from '../Section/Section';
import Container from '../Container/Container';
import { getPhotos } from '../../services/photos';
import Form from '../Form/Form';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import type { Photo } from '../../types/photo';
import Loader from '../Loader/Loader';
import Text from '../Text/Text';
import PhotosGallery from '../PhotosGallery/PhotosGallery';
// import Modal from '../Modal/Modal';
import ImageModal from '../ImageModal/ImageModal';
import Button from '../Button/Button';

export default function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>('');

  const handleSearch = async (newQuery: string) => {
    setError(false);
    setIsLoading(true);
    setPhotos([]);
    setPage(1);
    setQuery(newQuery);
  };

  useEffect(() => {
    if (!query) return;
    const fetchImages = async () => {
      try {
        const fetchedPhotos = await getPhotos(query, page);
        if (!fetchedPhotos.length) {
          toast.error('No photos found for your request');
          return;
        }
        setPhotos((prev) => [...prev, ...fetchedPhotos]);
      } catch {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, [page, query]);

  const handleSelectPhoto = (photo: Photo | null) => {
    setModalIsOpen(true);
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedPhoto(null);
  };
  const onLoad = () => {
    setPage((prev) => prev + 1);
  };
  return (
    <>
      <Section>
        <Container>
          <Form onSubmit={handleSearch} />
          {isLoading && <Loader />}
          {error && <Text>Something went wrong...</Text>}
          {photos.length > 0 && (
            <PhotosGallery
              photos={photos}
              handleSelectPhoto={handleSelectPhoto}
            />
          )}

          {!isLoading && photos.length > 0 && (
            <Button
              onClick={onLoad}
              disabled={isLoading}
            >
              {isLoading ? 'Loading..' : 'Load More'}
            </Button>
          )}
          <ImageModal
            modalIsOpen={modalIsOpen}
            closeModal={closeModal}
            src={selectedPhoto?.src.large}
            alt={selectedPhoto?.alt}
          />

          {/* {selectedPhoto && (
            <Modal onClose={() => setSelectedPhoto(null)}>
              <div
                style={{
                  backgroundColor: selectedPhoto.avg_color,
                  borderColor: selectedPhoto.avg_color,
                }}
              >
                <img src={selectedPhoto.src.large} alt={selectedPhoto.alt} />
              </div>
            </Modal>
          )} */}
        </Container>
      </Section>
      <Toaster />
    </>
  );
}
