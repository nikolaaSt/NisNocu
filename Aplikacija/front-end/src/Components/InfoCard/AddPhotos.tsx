import { ChangeEvent, useEffect, useState } from "react";
import { Col, Row, FormLabel, FormControl, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import LogoType from "../../types/LogoType";
import PhotoType from "../../types/PhotoType";

const AddPhotos = () => {
    const [showPopup, setPopup] = useState(false);
    const { id } = useParams();
    const [buttonLogo, setButtonLogo] = useState(false);
    const [buttonPhoto1, setButtonPhoto1] = useState(false);
    const [buttonPhoto2, setButtonPhoto2] = useState(false);
    const [addBtn, setAddBtn] = useState(false)
    const [logoAdminIds, setLogoUserIds] = useState<LogoType[]>([]);
    const [photoAdminIds, setPhotoAdminIds] = useState<PhotoType[]>([]);

    const [imagePath, setImagePath] = useState({
        imagePath: '',
        id: id,
    })
    const openPopup = () => {
        setPopup(true);
    };

    const closePopup = () => {
        setPopup(false);
        reloadPage();
    };

    const reloadPage = () => {
        window.location.reload();
    };

    useEffect(() => {
        fetchLogos();
    }, []);

    const fetchLogos = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/logos');
            if (!response.ok) {
                throw new Error('Failed to fetch logos');
            }

            const logoData = await response.json();
            const adminIds = logoData.map((logo: LogoType) => logo.administratorId);
            setLogoUserIds(adminIds);
        } catch (error) {
            console.error('Error fetching logos:', error);
        }
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/photos');
            if (!response.ok) {
                throw new Error('Failed to fetch photos');
            }

            const photoData = await response.json();
            const adminIds = photoData.map((photo: PhotoType) => photo.administratorId);
            setPhotoAdminIds(adminIds);
        } catch (error) {
            console.error('Error fetching photos:', error);
        }
    };

    const formInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
        const fullPath = event.target.value;
        const fileName = fullPath.split('\\').pop();
        setImagePath({ ...imagePath, [event.target.name]: fileName });
    };

    const handleAdd1 = () => {
        const fileInputPhotos = document.getElementById('fileInputPhotos') as HTMLInputElement;
        const filePhotos = fileInputPhotos.files?.[0];
        if (filePhotos) {
            AddPhoto(Number(id), filePhotos);
        }
        setButtonPhoto1(true);
    }

    const handleAdd2 = () => {
        const fileInputPhotos = document.getElementById('fileInputPhotos2') as HTMLInputElement;
        const filePhotos = fileInputPhotos.files?.[0];
        if (filePhotos) {
            AddPhoto(Number(id), filePhotos);
        }
        setButtonPhoto2(true);
    }

    const AddPhoto = (id: number, file: File): Promise<void> => {
        const url = `http://localhost:3000/api/administrator/${id}/uploadPhoto`;
        const formData = new FormData();
        formData.append('photo', file);

        return fetch(url, {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Image upload failed!');
                }
            })
            .then(() => {
                console.log('Image successfully uploaded');
            })
            .catch(error => {
                console.error('Error during image upload:', error);
            });
    };


    const handleLogo = () => {
        const fileInputLogo = document.getElementById('fileInputLogo') as HTMLInputElement;
        const fileLogo = fileInputLogo.files?.[0];
        if (fileLogo) {
            AddLogo(Number(id), fileLogo);
        }
        setButtonLogo(true);
    }

    const AddLogo = (id: number, file: File): Promise<void> => {
        const url = `http://localhost:3000/api/administrator/${id}/logo`;
        const formData = new FormData();
        formData.append('logo', file);

        return fetch(url, {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Logo upload failed!');
                }
            })
            .then(() => {
                console.log('Logo successfully uploaded');
            })
            .catch(error => {
                console.error('Error during image upload:', error);
            });
    };

    useEffect(() => {
        if (id && logoAdminIds.toString().includes(id) && photoAdminIds.toString().includes(id)) {
            setAddBtn(true);
        }
    }, [id, logoAdminIds, photoAdminIds]);

    return (
        <div>
            <button
                onClick={openPopup}
                className={`addphoto ${addBtn ? 'none-button' : ''}`}
            >
                DODAJ SLIKE
            </button>
            {showPopup && (
                <div className="popup">
                    <Button className='zatvori'
                        onClick={closePopup}> X </Button>
                    <FormLabel htmlFor="photos">Dodaj logo:</FormLabel>
                    <Row>
                        <Col md="8">
                            <FormControl type="file"
                                id="fileInputLogo"

                                onChange={formInputChanged}
                            />
                        </Col>
                        <Col md="4">
                            <Button
                                style={{ fontWeight: "500" }}
                                variant="primary"
                                onClick={() => handleLogo()}
                                disabled={buttonLogo}
                            >
                                Dodaj
                            </Button>
                        </Col>
                    </Row>
                    <FormLabel htmlFor="photos" style={{ marginTop: "5px" }}>Dodaj fotografije:</FormLabel>
                    <Row >
                        <Col md="8">
                            <FormControl type="file"
                                id="fileInputPhotos"
                                onChange={formInputChanged}
                            />
                        </Col>
                        <Col md="4">
                            <Button
                                style={{ fontWeight: "500" }}
                                variant="primary"
                                onClick={() => handleAdd1()}
                                disabled={buttonPhoto1}
                            >
                                Dodaj
                            </Button>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: "8px" }}>
                        <Col md="8">
                            <FormControl type="file"
                                id="fileInputPhotos2"
                                onChange={formInputChanged}
                            />
                        </Col>
                        <Col md="4">
                            <Button
                                style={{ fontWeight: "500" }}
                                variant="primary"
                                onClick={() => handleAdd2()}
                                disabled={buttonPhoto2}
                            >
                                Dodaj
                            </Button>
                        </Col>
                    </Row>

                    {/* <Alert variant="danger"
        > { ova klasa cini da leement bude sakriven }
        {    {registerData.message} }
    </Alert>*/}

                </div >
            )}
            {showPopup && <div className="overlay" onClick={closePopup} />}
        </div>
    );
}
export default AddPhotos;