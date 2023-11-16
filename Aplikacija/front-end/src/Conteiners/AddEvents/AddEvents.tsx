import React, { ChangeEvent, useState } from "react";
import { Button, Card, Col, FormGroup, Row } from "react-bootstrap";
import { Form } from "react-bootstrap";
import "./AddEvents.scss";
import jwtDecode, { JwtPayload } from "jwt-decode";

const AddEvents = () => {
  const [showPopup, setPoppup] = useState(false);

  const openPopup = () => {
    setPoppup(true);
  };

  const closePopup = () => {
    setPoppup(false);
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const [DateData, setDateData] = useState({
    description: "",
    startHour: "",
    startDate: "",
    finishDate: "",
    finishHour: "",
    maxTables: 10,
    maxLounges: 5,
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDateData({ ...DateData, [event.target.name]: event.target.value });
  };

  const addEventPlease = () => {
    addEvent(DateData);
    setPoppup(false);
    reloadPage();
  };

  const addEvent = (DateData: {
    description: string;
    startDate: string;
    finishDate: string;
    startHour: string;
    finishHour: string;
    maxTables: number;
    maxLounges: number;
  }) => {
    const url = "http://localhost:3000/api/events/add/:id";
    const token = localStorage.getItem("token");
    let adminId;
    if (token) {
      const decodedToken = jwtDecode<JwtPayload>(token);
      if ("id" in decodedToken) {
        adminId = decodedToken.id;
      }
    }

    const apiUrl = url.replace(":id", adminId ? adminId.toString() : "");

    return fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(DateData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("failed to add");
        }
        return response.json();
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  return (
    <div className="button-container">
      <Button className="button3" onClick={openPopup}>
        <p>Dodaj događaj</p>
      </Button>
      {showPopup && (
        <div className="popup">
          <Card.Body>
            <Button className="zatvori" onClick={closePopup}>
              {" "}
              X{" "}
            </Button>
            <Card.Text>
              <Form>
                <FormGroup className="forma">
                  <Form.Label
                    htmlFor="description"
                    style={{ fontWeight: "500" }}
                  >
                    Opis događaja:
                  </Form.Label>
                  <Form.Control
                    id="description"
                    name="description"
                    as="textarea"
                    rows={2}
                    style={{
                      border: "solid",
                      borderWidth: "1px",
                    }}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <Row className="forma">
                  <Col md="6">
                    <FormGroup className="forma">
                      <Form.Label
                        htmlFor="description"
                        style={{ fontWeight: "500" }}
                      >
                        Datum početka:
                      </Form.Label>
                      <Form.Control
                        type="date"
                        id="date"
                        name="startDate"
                        value={DateData.startDate}
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
                    <FormGroup className="forma">
                      <Form.Label
                        htmlFor="description"
                        style={{ fontWeight: "500" }}
                      >
                        Vreme početka:
                      </Form.Label>
                      <Form.Control
                        type="time"
                        id="time"
                        name="startHour"
                        value={DateData.startHour}
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
                <Row className="forma">
                  <Col md="6">
                    <FormGroup className="forma">
                      <Form.Label
                        htmlFor="description"
                        style={{ fontWeight: "500" }}
                      >
                        Datum kraja:
                      </Form.Label>
                      <Form.Control
                        type="date"
                        id="date"
                        name="finishDate"
                        value={DateData.finishDate}
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
                    <FormGroup className="forma">
                      <Form.Label
                        htmlFor="description"
                        style={{ fontWeight: "500" }}
                      >
                        Vreme kraja:
                      </Form.Label>
                      <Form.Control
                        type="time"
                        id="time"
                        name="finishHour"
                        value={DateData.finishHour}
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
                <Row className="forma">
                  <Col md="6">
                    <FormGroup>
                      <Form.Label
                        htmlFor="description"
                        style={{ fontWeight: "500" }}
                      >
                        Max broj stolova:
                      </Form.Label>
                      <Form.Control
                        type="number"
                        id="number"
                        name="maxTables"
                        min={1}
                        max={50}
                        value={DateData.maxTables}
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
                      <Form.Label
                        htmlFor="description"
                        style={{ fontWeight: "500" }}
                      >
                        Max broj separea:
                      </Form.Label>
                      <Form.Control
                        type="number"
                        id="number"
                        name="maxLounges"
                        min={1}
                        max={30}
                        value={DateData.maxLounges}
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
              </Form>
            </Card.Text>
            <Button className="button4" onClick={addEventPlease}>
              <p>Napravi događaj</p>
            </Button>
          </Card.Body>
        </div>
      )}
      {showPopup && <div className="overlay" onClick={closePopup} />}
    </div>
  );
};
export default AddEvents;
