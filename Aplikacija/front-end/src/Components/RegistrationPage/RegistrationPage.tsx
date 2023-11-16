import React, { ChangeEvent, useState } from "react";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Col, Card, Alert, Button, Form, FormGroup, Row } from "react-bootstrap";
import "./RegistrationPage.scss";
import { useNavigate } from "react-router-dom";

const RegistrationPage = () => {
    const [registrationData, setRegistrationData] = useState({
        email: '',
        password: '',
        forename: '',
        surname: '',
        nickname: '',
        phone_number: '',
    });

    const formInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setRegistrationData({ ...registrationData, [event.target.name]: event.target.value });
    };

    const navigate = useNavigate();

    const handleReg = () => {
        registerUser(registrationData);
        navigate("/login");
    }

    const registerUser = (registrationData: { email: string, password: string, forename: string, surname: string, nickname: string, phone_number: string }) => {
        const url = 'http://localhost:3000/auth/user/register';

        return fetch(url,
            {
                method: 'PUT',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(registrationData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Registration failed!')
                }
                return response.json()
            }).then(data => {
                if (data.status === 'error') {
                    throw new Error(data.message);
                }
                console.log('Registration successful!');
            }).catch(error => {
                console.error('error during registration: ', error);
            }
        )
    }
    return (
        <Container className="box">
            <Col md={{ span: 8, offset: 2 }}>
                <Card className="card1">
                    <Card.Body>
                        <Card.Title className="title">
                            <FontAwesomeIcon icon={faUserPlus} /> Registracija
                        </Card.Title>
                        <Form>
                            <Row className="forma">
                                <Col md="6">
                                    <FormGroup>
                                        <Form.Label htmlFor="email">E-mail:</Form.Label>
                                        <Form.Control type="email" id="email" name="email" onChange={formInputChanged} />
                                    </FormGroup>
                                </Col>

                                <Col md="6">
                                    <FormGroup>
                                        <Form.Label htmlFor="password">Lozinka:</Form.Label>
                                        <Form.Control type="password" id="password" name="password" onChange={formInputChanged} />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row className="forma">
                                <Col md="6">
                                    <FormGroup>
                                        <Form.Label htmlFor="forename">Ime:</Form.Label>
                                        <Form.Control type="text" id="forename" name="forename" onChange={formInputChanged} />
                                    </FormGroup>
                                </Col>

                                <Col md="6">
                                    <FormGroup>
                                        <Form.Label htmlFor="surname">Prezime:</Form.Label>
                                        <Form.Control type="text" id="surname" name="surname" onChange={formInputChanged} />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row className="forma">
                                <Col md="6">
                                    <FormGroup>
                                        <Form.Label htmlFor="nickname">Nadimak:</Form.Label>
                                        <Form.Control type="text" id="nickname" name="nickname" onChange={formInputChanged} />
                                    </FormGroup>
                                </Col>

                                <Col md="6">
                                    <FormGroup>
                                        <Form.Label htmlFor="phone">Telefon:</Form.Label>
                                        <Form.Control type="phone" id="phone" name="phone_number" onChange={formInputChanged} />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <FormGroup>
                                <Button className="button1"

                                    variant="primary"
                                    onClick={() => handleReg()}>
                                    Registracija
                                </Button>
                            </FormGroup>
                        </Form>
                        {/* <Alert variant="danger"
                            > { ova klasa cini da leement bude sakriven }
                            {    {registerData.message} }
                        </Alert>*/}
                    </Card.Body>
                </Card>
            </Col>
        </Container>
    )
}

export default RegistrationPage;
