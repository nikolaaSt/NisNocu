import * as React from 'react';
import { Card, Row, Col, Button, Form, FormGroup } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import EventType from '../../types/EventType';
import AdminType from '../../types/AdminType';
import { useNavigate, useParams } from 'react-router-dom';
import ReservationType from '../../types/ReservationType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faQrcode } from '@fortawesome/free-solid-svg-icons';
import jwtDecode from 'jwt-decode';

interface ContentState {
    events: EventType[];
}

interface DecodedToken {
    role: string;
    id: number;
}

const ContentUser: React.FC = () => {
    const { id } = useParams();
    const [eventinfo, setInfo] = useState<ContentState>({
        events: [],
    });
    const [admins, setAdmins] = useState<AdminType[]>([]);
    const [reservedEventIds, setReservedEventIds] = useState<number[]>([]);
    const [reservedUserIds, setReservedUserIds] = useState<number[]>([]);
    const [reservIds, setReservIds] = useState<number[]>([]);

    const token = localStorage.getItem("token");
    let roles;
    let ids: number | undefined;
    if (token) {
        const decodedToken = jwtDecode<DecodedToken>(token);
        roles = decodedToken.role;
        ids = decodedToken.id;
    }

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/administrator');
            if (!response.ok) {
                throw new Error('Failed to fetch admins');
            }

            const adminData = await response.json();
            setAdmins(adminData);
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/reservations');
            if (!response.ok) {
                throw new Error('Failed to fetch reservations');
            }

            const reservationData = await response.json();
            const eventIds = reservationData.map((reservation: ReservationType) => reservation.eventId);
            setReservedEventIds(eventIds);
            const userIds = reservationData.map((reservation: ReservationType) => reservation.userId);
            setReservedUserIds(userIds);
            const resIds = reservationData.map((reservation: ReservationType) => reservation.reservationId);
            setReservIds(resIds);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    };

    const setInfoWithEvents = (data: EventType[]) => {
        setInfo(prevState => ({
            ...prevState,
            events: data,
        }));
    };

    function SingleEvent({ event }: { event: EventType }) {
        const [showPopup, setPopup] = useState(false);
        const [isActive, setIsActive] = useState(false);

        const openPopup = () => {
            setPopup(true);
        };

        const closePopup = () => {
            setPopup(false);
        };

        const token = localStorage.getItem("token");
        let role: string;
        let ids: string | number | undefined;
        if (token) {
            const decodedToken = jwtDecode<DecodedToken>(token);
            role = decodedToken.role;
            ids = decodedToken.id
        }

        useEffect(() => {
            if (role == "user" && ids == id) {
                setIsActive(true)
            }
        }, []);

        const admin = admins.find((admin) => admin.administratorId === event.administratorId);
        const adminUsername = admin ? admin.username : 'Unknown';
        const adminAddress = admin ? admin.address : 'Unknown';

        let startT: string | undefined;
        let endT: string | undefined;
        if (event.startsAtTime) {
            startT = event.startsAtTime.substring(0, 5);
        }
        if (event.finishesAtTime) {
            endT = event.finishesAtTime.substring(0, 5);
        }

        let startD;
        let endD;
        if (event.startsAtDate) {
            const originalDate = event.startsAtDate;
            const parts = originalDate.split('-');
            startD = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        if (event.finishesAtDate) {
            const originalDate = event.finishesAtDate;
            const parts = originalDate.split('-');
            endD = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }

        const navigate = useNavigate();

        const qrcode = () => {
            for (let i = 0; i <= reservedEventIds.length; i++) {
                if (reservedEventIds[i] === event.eventId && reservedUserIds[i] === ids) {
                    navigate(`/qrcode/${reservIds[i]}`)
                }
            }
        }

        const reloadPage = () => {
            window.location.reload();
        };
    
        const handleDelete = () => {
            for (let i = 0; i <= reservedEventIds.length; i++) {
                if (reservedEventIds[i] === event.eventId && reservedUserIds[i] === ids) {
                    fetch(`http://localhost:3000/api/reservations/${reservIds[i]}`, {
                        method: 'DELETE',
                    })
                        .then(response => {
                            if (response.ok) {
                                console.log('Događaj je uspješno obrisan iz baze podataka.');
                            } else {
                                console.error('Greška prilikom brisanja događaja iz baze podataka.');
                            }
                        })
                        .catch(error => {
                            console.error('Došlo je do pogreške prilikom slanja zahtjeva:', error);
                        });
                }
            }
            setPopup(false);
            reloadPage();
        }

        for (let i = 0; i <= reservedEventIds.length; i++) {
            if (reservedEventIds[i] === event.eventId && reservedUserIds[i].toString() === id) {
                return (
                    <>
                        <div key={event.eventId}>
                            <section className="cardeventprofile" onClick={openPopup}>
                                <div className="localname">
                                    <p>
                                        {adminUsername?.toUpperCase()}
                                    </p>
                                </div>
                                <div className="time">
                                    {`${startT}H - ${endT}H`}
                                </div>
                            </section>
                            {showPopup && (
                                <div className="popup">
                                    <Card.Body>
                                        <Button className='zatvori'
                                            onClick={closePopup}> X </Button>
                                        <Card.Text >
                                            <Form>
                                                <FormGroup>
                                                    <h3>{adminUsername}</h3>
                                                    <p style={{ fontStyle: "italic" }}>{adminAddress}</p>
                                                </FormGroup>
                                                <Row>
                                                    <Col md="6">
                                                        <FormGroup>
                                                            <p className="label">
                                                                Datum početka:
                                                            </p>
                                                            <p className="text">
                                                                {startD}
                                                            </p>
                                                        </FormGroup>
                                                    </Col>

                                                    <Col md="6">
                                                        <FormGroup>
                                                            <p className="label">
                                                                Datum završetka:
                                                            </p>
                                                            <p className="text">
                                                                {endD}
                                                            </p>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="6">
                                                        <FormGroup>
                                                            <p className="label">
                                                                Vreme početka:
                                                            </p>
                                                            <p className="text">
                                                                {startT}
                                                            </p>
                                                        </FormGroup>
                                                    </Col>

                                                    <Col md="6">
                                                        <FormGroup>
                                                            <p className="label">
                                                                Vreme završetka:
                                                            </p>
                                                            <p className="text">
                                                                {endT}
                                                            </p>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md="12">
                                                        <FormGroup>
                                                            <p className="label">
                                                                Opis dogadjaja:
                                                            </p>
                                                            <p className="text">
                                                                {event.description}
                                                            </p>
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </Card.Text>
                                        <div className="bt3">
                                            {isActive ? (
                                                <Row>
                                                    <Col md="6">
                                                        <Button className="button4"
                                                            style={{
                                                                display: 'block',
                                                                backgroundColor: "green",
                                                            }}
                                                            onClick={qrcode}
                                                        >
                                                            <p>
                                                                <FontAwesomeIcon icon={faQrcode} /> QR CODE
                                                            </p>
                                                        </Button>
                                                    </Col>
                                                    <Col md="6">
                                                        <Button className="btndelete"
                                                            onClick={handleDelete}
                                                        >
                                                            <p>OTKAŽI REZERVACIJU</p>
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            ) : (
                                                <Button className="button4"
                                                    style={{
                                                        backgroundColor: "green",
                                                        pointerEvents: "none",
                                                        display: "none"
                                                    }}
                                                >
                                                    <p>
                                                        <FontAwesomeIcon icon={faCircleCheck} /> REZERVISANO
                                                    </p>
                                                </Button>
                                            )}
                                        </div>
                                    </Card.Body>
                                </div>
                            )}
                            {showPopup && <div className="overlay" onClick={closePopup} />}
                        </div>
                    </>
                );
            }
        }
        return null;
    }

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/events`);
            if (!response.ok) {
                throw new Error('Error fetching event data');
            }

            const responseData = await response.text();

            if (!responseData) {
                throw new Error('Nema dogadjaja!');
            }

            const eventData = JSON.parse(responseData);
            console.log(eventData)
            setInfoWithEvents(eventData);
        } catch (error) {
            console.log('Error fetching event data:', error);
        }
    };

    return (
        <>
            <Row>
                <Col md={{ span: 10, offset: 1 }}>
                    {eventinfo.events && eventinfo.events.length > 0 && eventinfo.events.map((event) => (
                        <SingleEvent key={event.eventId} event={event} />))
                    }
                </Col>
            </Row>

        </>
    );
}
export default ContentUser;
