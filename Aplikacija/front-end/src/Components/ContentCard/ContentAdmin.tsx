import * as React from "react";
import { Card, Row, Col, Button, Form, FormGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import EventType from "../../types/EventType";
import AdminType from "../../types/AdminType";
import { Link, useNavigate, useParams } from "react-router-dom";
import jwtDecode, { JwtPayload } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faQrcode } from "@fortawesome/free-solid-svg-icons";
import ReservationType from "../../types/ReservationType";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";

interface ContentState {
  events: EventType[];
}

interface DecodedToken {
  role: string;
  id: number;
}

const ContentAdmin: React.FC = () => {
  const { id } = useParams();
  const [eventinfo, setInfo] = useState<ContentState>({
    events: [],
  });
  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [reservedEventIds, setReservedEventIds] = useState<number[]>([]);
  const [reservedUserIds, setReservedUserIds] = useState<number[]>([]);
  const [reservIds, setReservIds] = useState<number[]>([]);

  const token = localStorage.getItem("token");
  let role: string;
  let ids: string | number | undefined;
  if (token) {
    const decodedToken = jwtDecode<DecodedToken>(token);
    role = decodedToken.role;
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

      const adminData = await response.json();
      setAdmins(adminData);
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
      if (role == "administrator" && ids == id) {
        setIsActive(true);
      } else if (role === "superadministrator") {
        setIsActive(true);
      }
    }, []);

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

    const reloadPage = () => {
      window.location.reload();
    };

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

    const [DateData, setDateData] = useState({
      description: "",
      startHour: "",
      startDate: "",
      finishDate: "",
      finishHour: "",
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setDateData({ ...DateData, [event.target.name]: event.target.value });
    };

    const [value, setValue] = useState("");
    const typeData = { type: value };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
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

          const secondUrl = `http://localhost:3000/api/qrcode/ronaldo/${reservationId}`;
          return fetch(secondUrl, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        })
        .then((secondResponse) => {
          if (!secondResponse.ok) {
            throw new Error("failed to fetch reservation");
          }
          console.log(secondResponse);
          return secondResponse.json();
        })
        .catch((error) => {
          console.error("error", error);
        });
    };

    const handleDelete = () => {
      fetch(`http://localhost:3000/api/events/${event.eventId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            console.log("Događaj je uspješno obrisan iz baze podataka.");
          } else {
            console.error(
              "Greška prilikom brisanja događaja iz baze podataka."
            );
          }
        })
        .catch((error) => {
          console.error(
            "Došlo je do pogreške prilikom slanja zahtjeva:",
            error
          );
        });
    };

    const handleEdit = () => {
      editEvent(DateData);
      reloadPage();
      setPopup(false);
    };

    const editEvent = (DateData: {
      startDate: string;
      finishDate: string;
      startHour: string;
      finishHour: string;
      description: string;
    }) => {
      const url = `http://localhost:3000/api/events/edit/${event.eventId}`;

      return fetch(url, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(DateData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Edit failed!");
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === "error") {
            throw new Error(data.message);
          }
          console.log("Edit successful!");
        })
        .catch((error) => {
          console.error("error during editing: ", error);
        });
    };

    if (role === "administrator" || role === "superadministrator") {
      return (
        <>
          <div key={event.eventId}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <section
                className="cardeventprofile"
                style={{ flexGrow: "1" }}
                onClick={openPopup}
              >
                <div className="localname">
                  <p>{adminUsername?.toUpperCase()}</p>
                </div>
                <div className="time">{`${startT}H - ${endT}H`}</div>
              </section>
            </div>
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
                            <Form.Control
                              type="date"
                              id="date"
                              name="startDate"
                              onChange={handleInputChange}
                              style={{
                                borderRadius: "4px",
                                border: "solid",
                                borderWidth: "1px",
                                fontSize: "18px",
                              }}
                            />
                          </FormGroup>
                        </Col>

                        <Col md="6">
                          <FormGroup>
                            <p className="label">Datum završetka:</p>
                            <Form.Control
                              type="date"
                              id="date"
                              name="finishDate"
                              onChange={handleInputChange}
                              style={{
                                borderRadius: "4px",
                                border: "solid",
                                borderWidth: "1px",
                                fontSize: "18px",
                              }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <FormGroup>
                            <p className="label">Vreme početka:</p>
                            <Form.Control
                              type="time"
                              id="time"
                              name="startHour"
                              onChange={handleInputChange}
                              style={{
                                borderRadius: "4px",
                                border: "solid",
                                borderWidth: "1px",
                                fontSize: "18px",
                              }}
                            />
                          </FormGroup>
                        </Col>

                        <Col md="6">
                          <FormGroup>
                            <p className="label">Vreme završetka:</p>
                            <Form.Control
                              type="time"
                              id="time"
                              name="finishHour"
                              onChange={handleInputChange}
                              style={{
                                borderRadius: "4px",
                                border: "solid",
                                borderWidth: "1px",
                                fontSize: "18px",
                              }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <p className="label">Opis dogadjaja:</p>
                            <Form.Control
                              id="description"
                              name="description"
                              as="textarea"
                              rows={3}
                              style={{
                                border: "solid",
                                borderWidth: "1px",
                              }}
                              onChange={handleInputChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="bt3" style={{ marginTop: "15px" }}>
                        {isActive ? (
                          <Row>
                            <Col md="6">
                              <Button className="btnedit" onClick={handleEdit}>
                                <p>PROMENI</p>
                              </Button>
                            </Col>
                            <Col md="6">
                              <Button
                                className="btndelete"
                                onClick={handleDelete}
                              >
                                <p>OBRIŠI</p>
                              </Button>
                            </Col>
                          </Row>
                        ) : (
                          <Button
                            className="btndelete"
                            style={{ display: "none" }}
                          >
                            <p>OBRIŠI</p>
                          </Button>
                        )}
                      </div>
                    </Form>
                  </Card.Text>
                </Card.Body>
              </div>
            )}
            {showPopup && <div className="overlay" onClick={closePopup} />}
          </div>
        </>
      );
    } else if (role === "user") {
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
    } else {
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
                    <Button
                      className="button4"
                      onClick={addReservationPlease}
                      style={{
                        display: "block",
                        pointerEvents: "none",
                      }}
                    >
                      <p>REZERVIŠI</p>
                    </Button>
                    <p
                      style={{
                        color: "darkred",
                        marginTop: "10px",
                        fontSize: "18px",
                        fontWeight: "500",
                      }}
                    >
                      Moraš da se prijaviš! <Link to="/login">Prijavi se</Link>
                    </p>
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

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/events/admin/${id}`
      );
      if (!response.ok) {
        throw new Error("Error fetching event data");
      }

      const responseData = await response.text();

      if (!responseData) {
        throw new Error("Nema dogadjaja!");
      }

      const eventData = JSON.parse(responseData);
      setInfoWithEvents(eventData);
    } catch (error) {
      console.log("Error fetching event data:", error);
    }
  };

  return (
    <>
      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          {eventinfo.events &&
            eventinfo.events.length > 0 &&
            eventinfo.events.map((event) => (
              <SingleEvent key={event.eventId} event={event} />
            ))}
        </Col>
      </Row>
    </>
  );
};
export default ContentAdmin;
