import type { Photo } from '../../types/photo';
import Grid from '../Grid/Grid';
import PhotosGalleryItem from '../PhotosGalleryItem/PhotosGalleryItem';

interface PhotosGalleryProps {
  photos: Photo[];
  handleSelectPhoto: (photo: Photo) => void;
}

export default function PhotosGallery({
  photos,
  handleSelectPhoto,
}: PhotosGalleryProps) {
  return (
    <Grid>
      {photos.map((photo) => (
        <PhotosGalleryItem
          key={photo.id}
          photo={photo}
          handleSelectPhoto={handleSelectPhoto}
        />
      ))}
    </Grid>
  );
}
