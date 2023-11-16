import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Card,
  Col,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import PlacesCard from "../../Conteiners/PlacesCard/PlacesCard";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

const AddAdmin = () => {
  const [registrationData, setRegistrationData] = useState({
    password: "",
    username: "",
    phone_number: "",
    address: "",
    description: "",
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
    phone_number: string;
    address: string;
    description: string;
  }) => {
    const url = "http://localhost:3000/api/administrator/add";

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
  return (
    <>
      <div className="content__events">
        <div className="superadmin">
          <Row>
            <Col md={{ span: 12 }}>
              <Button className="addbtn" onClick={openPopup}>
                <p>Dodaj Admina</p>
              </Button>
            </Col>
          </Row>
          {showPopup && (
            <div className="popup">
              <Button className="zatvori" onClick={closePopup}>
                {" "}
                X{" "}
              </Button>
              <Col md={{ span: 12 }}>
                <Card.Body>
                  <Card.Title className="title">
                    <FontAwesomeIcon icon={faUserPlus} /> Dodaj admina
                  </Card.Title>
                  <Row className="forma">
                    <Col md="6">
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

                    <Col md="6">
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

                  <Row className="forma">
                    <Col md="12">
                      <FormGroup>
                        <FormLabel htmlFor="phone">Telefon:</FormLabel>
                        <FormControl
                          type="phone"
                          id="phone"
                          name="phone_number"
                          onChange={formInputChanged}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="forma">
                    <Col md="12">
                      <FormGroup>
                        <FormLabel htmlFor="address">Address:</FormLabel>
                        <FormControl
                          id="address"
                          as="textarea"
                          rows={1}
                          name="address"
                          onChange={formInputChanged}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row className="forma">
                    <Col md="12">
                      <FormGroup>
                        <FormLabel htmlFor="description">Opis:</FormLabel>
                        <FormControl
                          id="description"
                          as="textarea"
                          rows={3}
                          name="description"
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
                      Dodaj admina
                    </Button>
                  </FormGroup>
                  {/* <Alert variant="danger"
                    > { ova klasa cini da leement bude sakriven }
                    {    {registerData.message} }
                </Alert>*/}
                </Card.Body>
              </Col>
            </div>
          )}
          {showPopup && <div className="overlay" onClick={closePopup} />}
          <PlacesCard />
        </div>
      </div>
    </>
  );
};
export default AddAdmin;
