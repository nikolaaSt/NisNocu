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
import AddEvents from "../../Conteiners/AddEvents/AddEvents";
import EventType from "../../types/EventType";
import AdminType from "../../types/AdminType";

interface HomePageState {
  events: EventType[];
}

const AdminHomepage: React.FC = () => {
  const [eventinfo, setInfo] = useState<HomePageState>({
    events: [],
  });
  const [admins, setAdmins] = useState<AdminType[]>([]);

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

  const setInfoWithEvents = (data: EventType[]) => {
    setInfo((prevState) => ({
      ...prevState,
      events: data,
    }));
  };

  function SingleEvent({ event }: { event: EventType }) {
    const [showPopup, setPopup] = useState(false);

    const openPopup = () => {
      setPopup(true);
    };

    const closePopup = () => {
      setPopup(false);
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

    return (
      <>
        <div key={event.eventId}>
          <section className="cardevent" onClick={openPopup}>
            <div className="localname">
              <p>{adminUsername?.toUpperCase()}</p>
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
                  </Form>
                </Card.Text>
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
            <AddEvents />
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
export default AdminHomepage;
