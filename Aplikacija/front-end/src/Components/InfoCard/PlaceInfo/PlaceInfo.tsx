import { useState, useEffect } from "react";
import AdminType from "../../../types/AdminType";
import { Form, useParams } from "react-router-dom";
import Rating from "@mui/material/Rating";
import jwtDecode from "jwt-decode";
import {
  Card,
  Button,
  FormGroup,
  Row,
  Col,
  FormControl,
  FormLabel,
} from "react-bootstrap";

interface DecodedToken {
  role: string;
  id: number;
}

const PlaceInfo = () => {
  const { id } = useParams();
  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [idAdmin, setidAdmin] = useState(0);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  let role;
  let ids;
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      role = decodedToken.role;
      ids = decodedToken.id;
      if (role === "administrator") {
        setIsAdmin(true);
        setidAdmin(ids);
      } else if (role === "superadministrator") {
        setIsSuperAdmin(true);
      }
    }
  }, []);

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

  const admin = admins.find(
    (admin) => admin.administratorId?.toString() === id
  );
  const adminUsername = admin ? admin.username?.toLocaleUpperCase() : "Unknown";
  const adminAddress = admin ? admin.address : "Unknown";
  const adminPhone = admin ? admin.phoneNumber : "Unknown";
  const rating = admin ? admin.averageRating : 0;
  const desc = admin ? admin.description : "Unknown";

  const [showPopup, setPopup] = useState(false);

  const openPopup = () => {
    setPopup(true);
  };

  const closePopup = () => {
    setPopup(false);
  };

  const [DateData, setDateData] = useState({
    description: "",
    address: "",
    phone_number: "",
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDateData({ ...DateData, [event.target.name]: event.target.value });
  };

  const goEdit = () => {
    openPopup();
  };

  const reloadPage = () => {
    window.location.reload();
  };

  const handleEdit = () => {
    editEvent(DateData);
    reloadPage();
    setPopup(false);
  };

  const editEvent = (DateData: {
    description: string;
    address: string;
    phone_number: string;
  }) => {
    const url = `http://localhost:3000/api/administrator/edit/${id}`;

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

  if (isAdmin == true && idAdmin.toString() == id) {
    return (
      <>
        <div>
          <li className="info-list__list-item username">{adminUsername}</li>
          <li className="info-list__list-item infoAdress">{adminAddress}</li>
          <li className="info-list__list-item">{adminPhone}</li>
          <li>
            <Rating name="read-only" value={rating} precision={0.5} readOnly />
          </li>
          <li className="info-list__list-item rating">({rating})</li>
        </div>
        <p className="desc">{desc}</p>
        <button className="info-card__edit" onClick={goEdit}>
          <p>EDIT</p>
        </button>
        {showPopup && (
          <div className="popup" style={{ color: "black" }}>
            <Card.Body>
              <Button className="zatvori" onClick={closePopup}>
                {" "}
                X{" "}
              </Button>
              <Card.Text>
                <FormGroup>
                  <h3>{adminUsername}</h3>
                </FormGroup>
                <Row className="forma">
                  <Col md="12">
                    <FormGroup>
                      <FormLabel htmlFor="phone">Telefon:</FormLabel>
                      <FormControl
                        type="phone"
                        id="phone"
                        name="phone_number"
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row className="forma">
                  <Col md="12">
                    <FormGroup>
                      <FormLabel htmlFor="address">Address:</FormLabel>
                      <FormControl
                        type="address"
                        id="address"
                        as="textarea"
                        rows={1}
                        name="address"
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row className="forma">
                  <Col md="12">
                    <FormGroup>
                      <FormLabel htmlFor="description">Opis:</FormLabel>
                      <FormControl
                        type="description"
                        id="description"
                        as="textarea"
                        rows={3}
                        name="description"
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <div
                  className="bt3"
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Row>
                    <Col md="6">
                      <Button
                        className="btnedit"
                        style={{ margin: "auto" }}
                        onClick={handleEdit}
                      >
                        <p>PROMENI</p>
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Card.Text>
            </Card.Body>
          </div>
        )}
        {showPopup && <div className="overlay" onClick={closePopup} />}
      </>
    );
  } else if (isSuperAdmin === true) {
    return (
      <>
        <div>
          <li className="info-list__list-item username">{adminUsername}</li>
          <li className="info-list__list-item infoAdress">{adminAddress}</li>
          <li className="info-list__list-item">{adminPhone}</li>
          <li>
            <Rating name="read-only" value={rating} precision={0.5} readOnly />
          </li>
          <li className="info-list__list-item rating">({rating})</li>
        </div>
        <p className="desc">{desc}</p>
        <button className="info-card__edit" onClick={goEdit}>
          <p>EDIT</p>
        </button>
        {showPopup && (
          <div className="popup" style={{ color: "black" }}>
            <Card.Body>
              <Button className="zatvori" onClick={closePopup}>
                {" "}
                X{" "}
              </Button>
              <Card.Text>
                <FormGroup>
                  <h3>{adminUsername}</h3>
                </FormGroup>
                <Row className="forma">
                  <Col md="12">
                    <FormGroup>
                      <FormLabel htmlFor="phone">Telefon:</FormLabel>
                      <FormControl
                        type="phone"
                        id="phone"
                        name="phone"
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row className="forma">
                  <Col md="12">
                    <FormGroup>
                      <FormLabel htmlFor="address">Adresa:</FormLabel>
                      <FormControl
                        type="address"
                        id="address"
                        as="textarea"
                        rows={1}
                        name="address"
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row className="forma">
                  <Col md="12">
                    <FormGroup>
                      <FormLabel htmlFor="description">Opis:</FormLabel>
                      <FormControl
                        type="description"
                        id="description"
                        as="textarea"
                        rows={3}
                        name="description"
                        onChange={handleInputChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <div
                  className="bt3"
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Row>
                    <Col md="6">
                      <Button
                        className="btnedit"
                        style={{ margin: "auto" }}
                        onClick={handleEdit}
                      >
                        <p>PROMENI</p>
                      </Button>
                    </Col>
                  </Row>
                </div>
              </Card.Text>
            </Card.Body>
          </div>
        )}
        {showPopup && <div className="overlay" onClick={closePopup} />}
      </>
    );
  } else {
    return (
      <>
        <div>
          <li className="info-list__list-item username">{adminUsername}</li>
          <li className="info-list__list-item infoAdress">{adminAddress}</li>
          <li className="info-list__list-item">{adminPhone}</li>
          <li>
            <Rating name="read-only" value={rating} precision={0.5} readOnly />
          </li>
          <li className="info-list__list-item rating">({rating})</li>
        </div>
        <p className="desc">{desc}</p>
      </>
    );
  }
};

export default PlaceInfo;
