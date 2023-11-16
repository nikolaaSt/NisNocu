import { Container, Card, Col, FormControl, InputGroup, Row } from "react-bootstrap";
import "./Places.scss";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AdminType from "../../types/AdminType";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import img from "../../assets/avatar.svg";

interface PlacesState {
  admins: AdminType[];
}

export default function Places() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const [admininfo, setInfo] = useState<PlacesState>({
    admins: [],
  });

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
      setInfo({ admins: adminData });
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const SingleAdmin: React.FC<{ admin: AdminType }> = ({ admin }) => {

    const adminUsername = admin ? admin.username : "Unknown";
    const adminAddress = admin ? admin.address : "Unknown";
    const adminId = admin ? admin.administratorId : "Unknown";
    const rating = admin.averageRating ?? null;


    const onPlaceClick = () => {
      navigate(`/place/${adminId}`);
    };

    return (
      <>
        <div>
          <section onClick={onPlaceClick} className="cardplace">
            <div className="avatar">
              <Avatar src={img} sx={{ width: 60, height: 60 }} />
            </div>
            <div className="local">
              <h4>{adminUsername?.toUpperCase()}</h4>
              <p style={{ fontStyle: "italic" }}>{adminAddress}</p>
            </div>
            <div className="ratings">
              <Rating name="half-rating" value={rating} precision={0.5} readOnly />
              <p className="rating">({rating})</p>
            </div>
          </section>
        </div>
      </>
    );
  }

  return (
    <Container className="box">
      <div className="kartica">
        <Card.Body>
          <Col md={{ span: 6, offset: 3 }} style={{}}>
            <Form className="search">
              <InputGroup>
                <FormControl
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    fontWeight: "500",
                    fontSize: "18px",
                    border: "solid",
                    borderWidth: "1px"
                  }}
                  placeholder="Pronađi lokal..."
                />
              </InputGroup>
            </Form>
          </Col>
        </Card.Body>
        <Card.Body>
          <Row>
            <Col md={{ span: 10, offset: 1 }}>
              {admininfo.admins.filter((val) => {
                if (search == "") {
                  return val
                } else if (val.username?.toLowerCase().includes(search.toLowerCase())) {
                  return val
                }
              }).map((admin) => {
                return (
                  <SingleAdmin key={admin.username} admin={admin} />
                );
              })}
            </Col>
          </Row>
        </Card.Body>
      </div>
    </Container>
  );
}
