import * as React from "react";
import "./Homepage.scss";
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
} from "react-bootstrap";
import Calendar from "react-calendar";
import { useEffect, useState } from "react";
import EventType from "../../types/EventType";
import AdminType from "../../types/AdminType";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faQrcode } from "@fortawesome/free-solid-svg-icons";
import ReservationType from "../../types/ReservationType";
import { useNavigate } from "react-router-dom";

interface HomePageState {
  events: EventType[];
}

interface DecodedToken {
  role: string;
  id: number;
}

const UserHomepage: React.FC = () => {
  const [eventinfo, setInfo] = useState<HomePageState>({
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
      const response = await fetch("http://localhost:3000/api/administrator");
      if (!response.ok) {
        throw new Error("Failed to fetch admins");
      }

      const adminsData = await response.json();
      setAdmins(adminsData);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/reservations");
      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }

      const reservationData = await response.json();
      const eventIds = reservationData.map(
        (reservation: ReservationType) => reservation.eventId
      );
      setReservedEventIds(eventIds);
      const userIds = reservationData.map(
        (reservation: ReservationType) => reservation.userId
      );
      setReservedUserIds(userIds);
      const resIds = reservationData.map(
        (reservation: ReservationType) => reservation.reservationId
      );
      setReservIds(resIds);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const setInfoWithEvents = (data: EventType[]) => {
    setInfo((prevState) => ({
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

    useEffect(() => {
      for (let i = 0; i <= reservedEventIds.length; i++) {
        if (
          reservedEventIds[i] === event.eventId &&
          reservedUserIds[i] === ids
        ) {
          setIsActive(true);
        }
      }
    }, []);

    const admin = admins.find(
      (admin) => admin.administratorId === event.administratorId
    );
    const adminUsername = admin ? admin.username : "Unknown";
    const adminAddress = admin ? admin.address : "Unknown";

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
      const parts = originalDate.split("-");
      startD = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    if (event.finishesAtDate) {
      const originalDate = event.finishesAtDate;
      const parts = originalDate.split("-");
      endD = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    const [value, setValue] = useState("");
    const typeData = { type: value };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    };

    const reloadPage = () => {
      window.location.reload();
    };

    const navigate = useNavigate();

    const qrcode = () => {
      for (let i = 0; i <= reservedEventIds.length; i++) {
        if (
          reservedEventIds[i] === event.eventId &&
          reservedUserIds[i] === ids
        ) {
          navigate(`/qrcode/${reservIds[i]}`);
        }
      }
    };

    const addReservationPlease = () => {
      addReservation(typeData);
      setPopup(false);
      setIsActive(true);
      //reloadPage();
    };

    const addReservation = (typeData: { type: string }) => {
      const url = "http://localhost:3000/api/reservations/add/:userId/:eventId";
      const token = localStorage.getItem("token");
      let userId;
      if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);
        console.log(decodedToken);
        if ("id" in decodedToken) {
          userId = decodedToken.id;
        }
      }
      const apiUrl = url.replace(":userId", userId ? userId.toString() : "");
      const apiUrl2 = apiUrl.replace(
        ":eventId",
        event.eventId ? event.eventId.toString() : ""
      );
      return fetch(apiUrl2, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(typeData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("failed to add");
          }
          return response.json();
        })
        .then((responseData) => {
          const reservationId = responseData.reservationId;

          const userUrl = `http://localhost:3000/api/user/${ids}`;
          return fetch(userUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((userResponse) => {
              if (!userResponse.ok) {
                throw new Error("failed to fetch user information");
              }
              return userResponse.json();
            })
            .then((userData) => {
              console.log("HAHA", userData);
              return fetch(
                `http://localhost:3000/api/qrcode/ronaldo/${reservationId}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(userData),
                }
              );
            });
        })
        .then((thirdResponse) => {
          if (!thirdResponse.ok) {
            throw new Error("failed to fetch third URL");
          }

          console.log(thirdResponse);
          return thirdResponse.json();
        })
        .catch((error) => {
          console.error("error", error);
        });
    };

    return (
      <>
        <div key={event.eventId}>
          <section className="cardevent" onClick={openPopup}>
            <div className="localname">
              {!isActive ? (
                <p>{adminUsername?.toUpperCase()}</p>
              ) : (
                <p>
                  <FontAwesomeIcon icon={faCircleCheck} />{" "}
                  {adminUsername?.toUpperCase()}
                </p>
              )}
            </div>
            <div className="time">{`${startT}H - ${endT}H`}</div>
          </section>
          {showPopup && (
            <div className="popup">
              <Card.Body>
                <Button className="zatvori" onClick={closePopup}>
                  {" "}
                  X{" "}
                </Button>
                <Card.Text>
                  <Form>
                    <FormGroup>
                      <h3>{adminUsername}</h3>
                      <p style={{ fontStyle: "italic" }}>{adminAddress}</p>
                    </FormGroup>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <p className="label">Datum početka:</p>
                          <p className="text">{startD}</p>
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <p className="label">Datum završetka:</p>
                          <p className="text">{endD}</p>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <p className="label">Vreme početka:</p>
                          <p className="text">{startT}</p>
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <p className="label">Vreme završetka:</p>
                          <p className="text">{endT}</p>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <p className="label">Opis dogadjaja:</p>
                          <p className="text">{event.description}</p>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <RadioGroup
                          value={value}
                          onChange={handleChange}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            pointerEvents: isActive ? "none" : "auto",
                          }}
                        >
                          <Form.Label
                            style={{
                              paddingTop: "8px",
                              fontSize: "18px",
                              fontWeight: "500",
                            }}
                          >
                            Izaberi mesto:{" "}
                          </Form.Label>
                          <Col className="stack-col" style={{ gap: "5px" }}>
                            <FormControlLabel
                              value="Table"
                              control={<Radio />}
                              label="Sto"
                            />
                            <FormControlLabel
                              value="Lounge"
                              control={<Radio />}
                              label="Separe"
                            />
                          </Col>
                        </RadioGroup>
                      </Col>
                    </Row>
                  </Form>
                </Card.Text>
                <div className="bt3">
                  {!isActive ? (
                    <Button
                      className="button4"
                      onClick={addReservationPlease}
                      style={{ display: "block" }}
                    >
                      <p>REZERVIŠI</p>
                    </Button>
                  ) : (
                    <Button
                      className="button4"
                      style={{
                        display: "block",
                        backgroundColor: "green",
                      }}
                      onClick={qrcode}
                    >
                      <p>
                        <FontAwesomeIcon icon={faQrcode} /> QR CODE
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

  const [date, setDate] = useState<Date | null>(new Date());

  const handleDateChange = (value: any) => {
    setDate(value);
    fetchEvents(value);
  };

  const fetchEvents = async (date: React.SetStateAction<Date | null>) => {
    const newDate = date
      ?.toLocaleString("zh-Hans-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replaceAll("/", "-");
    try {
      const response = await fetch(
        `http://localhost:3000/api/events/date/${newDate}`
      );
      if (!response.ok) {
        throw new Error("Error fetching event data");
      }

      const responseData = await response.text();

      if (!responseData) {
        throw new Error("Nema dogadjaj za taj datum!");
      }

      const eventData = JSON.parse(responseData);
      setInfoWithEvents(eventData);
    } catch (error) {
      console.log("Error fetching event data:", error);
    }
  };

  return (
    <>
      <Container className="box">
        <section className="pocetna_kartica">
          <div className="calendar-container">
            <Calendar onChange={handleDateChange} value={date} />
          </div>
          <div className="event-list-items">
            {eventinfo.events &&
              eventinfo.events.length > 0 &&
              eventinfo.events.map((event) => (
                <SingleEvent key={event.eventId} event={event} />
              ))}
          </div>
        </section>
      </Container>
    </>
  );
};
export default UserHomepage;
