import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Alert, Button, Card, Col, Container, Form, FormGroup } from "react-bootstrap";
import "./LoginPage.scss"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import jwtDecode from "jwt-decode";

interface DecodedToken {
    role: string;
}

const Login = () => {

    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();
    const formInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [event.target.name]: event.target.value });
    };

    const handleLogin = () => {
        loginUser(loginData);
    }

    const reloadPage = () => {
        window.location.reload();
    };

    const loginUser = (loginData: { username: string, password: string }) => {
        const url = 'http://localhost:3000/auth/login';

        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(loginData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('login failed');
                }
                return response.json()
            })
            .then(data => {
                if (data.status === 'error') {
                    throw new Error(data.message);

                }
                const token = data.token;
                localStorage.setItem('token', token);
    
                const decodedToken = jwtDecode<DecodedToken>(token);
                const roles = decodedToken.role;
    
                console.log('Login Successful!');
                console.log('Roles:', roles);
                
                if(roles===  "administrator") {
                    navigate('/adminhomepage');
                    reloadPage();
                } else if(roles === "user") {
                    navigate('/userhomepage');
                    reloadPage();
                } else {
                    navigate('/superadmin');
                    reloadPage();
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
                setErrorMessage(error.message);
            })
    }

    return (
        <Container className="box">
            <Col md={{ span: 6, offset: 3 }}>
                <Card className="card1">
                    <Card.Body>
                        <Card.Title className="title">
                            <FontAwesomeIcon icon={faSignInAlt} /> Prijavi se
                        </Card.Title>
                        <Card.Text>
                            <Form>
                                <FormGroup className="forma">
                                    <Form.Label htmlFor="username">Username:</Form.Label>
                                    <Form.Control type="username" id="username" name="username"
                                        value={loginData.username}
                                        onChange={formInputChanged} />
                                </FormGroup>
                                <FormGroup className="forma">
                                    <Form.Label htmlFor="password">Lozinka:</Form.Label>
                                    <Form.Control type="password" id="password" name="password"
                                        value={loginData.password}
                                        onChange={formInputChanged} />
                                </FormGroup>
                                <FormGroup>
                                    <Button className="button2"
                                        variant="primary"
                                        onClick={() => handleLogin()}>
                                        Prijavi se
                                    </Button>
                                </FormGroup>
                            </Form>
                            <Alert variant="danger"
                                className={errorMessage ? '' : 'd-none'}>
                                {errorMessage}
                            </Alert>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Container>
    );
}
export default Login;