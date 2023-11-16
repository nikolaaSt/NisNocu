import "./SuperAdmin.scss";
import { ChangeEvent, useState } from "react";
import AddAdmin from "./AddAdmin";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Col,
  Button,
  Card,
  Row,
  FormGroup,
  FormLabel,
  FormControl,
} from "react-bootstrap";

const SuperAdmin = () => {
  const [registrationData, setRegistrationData] = useState({
    username: "",
    password: "",
  });
  const [showPopup, setPopup] = useState(false);

  const openPopup = () => {
    setPopup(true);
  };

  const closePopup = () => {
    setPopup(false);
  };

  const formInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setRegistrationData({
      ...registrationData,
      [event.target.name]: event.target.value,
    });
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const handleReg = () => {
    registerAdmin(registrationData);
    setPopup(false);
    reloadPage();
  };

  const registerAdmin = (registrationData: {
    password: string;
    username: string;
  }) => {
    const url = "http://localhost:3000/api/superadministrator/add";

    return fetch(url, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(registrationData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Registration failed!");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "error") {
          throw new Error(data.message);
        }
        console.log("Registration successful!");
      })
      .catch((error) => {
        console.error("error during registration: ", error);
      });
  };

  const renderContent = () => {
    return (
      <div className="content__events u-soft-edges">
        <AddAdmin />
      </div>
    );
  };

  return (
    <>
      <div className="place__card">
        <section className="place">
          <div className="place__content_sadmin u-soft-edges">
            <div className="content__nav u-soft-edges">
              <div className={"content__nav-item active u-soft-edges"}>
                <p>Dodaj Admina</p>
              </div>
              <div className={"content__nav-item u-soft-edges"}>
                <p onClick={openPopup}>Dodaj SuperAdmina</p>
                {showPopup && (
                  <div className="popup" style={{ color: "black" }}>
                    <Col md={{ span: 12 }}>
                      <Button className="zatvori" onClick={() => closePopup()}>
                        {" "}
                        X{" "}
                      </Button>
                      <Card.Body>
                        <Card.Title
                          className="title"
                          style={{ marginTop: "15px" }}
                        >
                          <FontAwesomeIcon icon={faUserPlus} /> Dodaj
                          SuperAdmina
                        </Card.Title>
                        <Row className="forma">
                          <Col md="12">
                            <FormGroup>
                              <FormLabel htmlFor="nickname">Ime:</FormLabel>
                              <FormControl
                                type="text"
                                id="nickname"
                                name="username"
                                onChange={formInputChanged}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="forma">
                          <Col md="12">
                            <FormGroup>
                              <FormLabel htmlFor="password">Lozinka:</FormLabel>
                              <FormControl
                                type="password"
                                id="password"
                                name="password"
                                onChange={formInputChanged}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <FormGroup>
                          <Button
                            className="button1"
                            variant="primary"
                            onClick={() => handleReg()}
                          >
                            Dodaj superadmina
                          </Button>
                        </FormGroup>
                        {/* <Alert variant="danger"
                    > { ova klasa cini da leement bude sakriven }
                    {    {registerData.message} }
                </Alert> */}
                      </Card.Body>
                    </Col>
                  </div>
                )}
                {showPopup && (
                  <div className="overlay" onClick={() => closePopup()} />
                )}
              </div>
            </div>
            {renderContent()}
          </div>
        </section>
      </div>
    </>
  );
};

export default SuperAdmin;
