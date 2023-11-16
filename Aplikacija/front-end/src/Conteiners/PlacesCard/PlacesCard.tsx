import React, { useEffect, useState } from "react";
import "./PlacesCard.css";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import { useNavigate } from "react-router-dom";
import AdminType from "../../types/AdminType";
import { Row, Col } from "react-bootstrap";
import img from "../../assets/avatar.svg";

interface PlacesCardState {
  admins: AdminType[];
}

const PlacesCard: React.FC = () => {
  const navigate = useNavigate();
  const [admininfo, setInfo] = useState<PlacesCardState>({
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
    <Row>
      <Col md={{ span: 10, offset: 1 }}>
        {admininfo.admins.map((admin) => (
          <SingleAdmin key={admin.administratorId} admin={admin} />
        ))}
      </Col>
    </Row>
  );
}
export default PlacesCard;
