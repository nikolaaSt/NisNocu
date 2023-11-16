import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyCarousel.scss";
import PhotoType from "../../types/PhotoType";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApiConfig } from "../../config/api.config";


function MyCarousel() {
  const { id } = useParams()
  const [adminPhotos, setAdminPhotos] = useState<PhotoType[]>([]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/photos');
      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }

      const photoData = await response.json();
      const adminPhotos = photoData.filter((adminPhoto: PhotoType) => adminPhoto.administratorId?.toString() === id);
      console.log(adminPhotos)
      setAdminPhotos(adminPhotos);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  return (
    <Carousel className="my-carousel">
      {adminPhotos.map((adminPhoto: PhotoType, index: number) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100 slide img"
            src={ApiConfig.PHOTO_PATH + adminPhoto.imagePath}
            alt={`Slide ${index + 1}`}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default MyCarousel;
