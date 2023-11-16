import Rating from "@mui/material/Rating";
import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ReviewType from "../../types/ReviewType";
import AdminType from "../../types/AdminType";

interface ReviewState {
  reviews: ReviewType[];
}

const ReviewsUser = () => {
  const { id } = useParams();
  const [reviwinfo, setReview] = useState<ReviewState>({
    reviews: [],
  });
  const [adminIds, setadminIds] = useState<number[]>([]);
  const [adminName, setadminName] = useState<string[]>([]);

  const setInfoWithReviews = (data: ReviewType[]) => {
    setReview((prevState) => ({
      ...prevState,
      reviews: data,
    }));
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/ratings/user/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch admins with logos");
      }

      const ratingData = await response.json();
      setInfoWithReviews(ratingData);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/administrator`);
      if (!response.ok) {
        throw new Error("Failed to fetch admins with logos");
      }
      const adminData = await response.json();
      const adminIds = adminData.map(
        (admin: AdminType) => admin.administratorId
      );
      setadminIds(adminIds);
      const adminName = adminData.map((admin: AdminType) => admin.username);
      setadminName(adminName);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  function SingleReview({ review }: { review: ReviewType }) {
    for (let i = 0; i <= adminIds.length; i++) {
      if (adminIds[i] === review.administratorId) {
        return (
          <div key={review.ratingId} style={{ marginTop: "15px" }}>
            <p className="admin_name">{adminName[i]}</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flexGrow: "1" }}>
                <textarea
                  style={{
                    marginTop: "5px",
                    width: "100%",
                    height: "50px",
                    padding: "8px",
                    resize: "none",
                    pointerEvents: "none",
                  }}
                  readOnly
                >
                  {review.comment}
                </textarea>
              </div>
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#1f2833",
                  borderRadius: "5%",
                }}
              >
                <Rating
                  name="half-rating"
                  value={review.rating}
                  precision={0.5}
                  readOnly
                />
              </div>
            </div>
          </div>
        );
      }
    }
    return null;
  }

  return (
    <Row>
      <Col md={{ span: 10, offset: 1 }}>
        {reviwinfo.reviews &&
          reviwinfo.reviews.length > 0 &&
          reviwinfo.reviews.map((review) => (
            <SingleReview key={review.ratingId} review={review} />
          ))}
      </Col>
    </Row>
  );
};
export default ReviewsUser;
