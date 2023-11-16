import { faComment } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Rating from "@mui/material/Rating";
import jwtDecode from "jwt-decode";
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import ReviewType from "../../types/ReviewType";
import UserType from "../../types/UserType";

interface DecodedToken {
    id: number;
    role: string;
}

interface ReviewState {
    reviews: ReviewType[];
}

const ReviewsAdmin = () => {
    const [reviwinfo, setReview] = useState<ReviewState>({
        reviews: [],
    });
    const { id } = useParams();
    const [showPopup, setPopup] = useState(false);
    const [isUser, setIsUser] = useState(false)
    const [idUSer, setidUser] = useState(0)
    const [userIds, setUserIds] = useState<number[]>([]);
    const [userNick, setuserNick] = useState<string[]>([]);

    const openPopup = () => {
        setPopup(true);
    };

    const closePopup = () => {
        setPopup(false);
    };

    let roles;
    let ids: number | undefined;
    const token = localStorage.getItem("token");
    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode<DecodedToken>(token);
            ids = decodedToken.id;
            roles = decodedToken.role;
            if (roles === "user") {
                setIsUser(true)
                setidUser(ids)
            }
        }
    }, []);

    const setInfoWithReviews = (data: ReviewType[]) => {
        setReview(prevState => ({
            ...prevState,
            reviews: data,
        }));
    };

    const [value, setValue] = useState<number>(0);
    const [reviewData, setReviewData] = useState({
        ratings: value,
        comment: ''
    });
    const formInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setReviewData({ ...reviewData, [event.target.name]: event.target.value });
    };

    const addReview = () => {
        review(reviewData);
        setPopup(false);
    }

    const setRating = (event: React.ChangeEvent<{}>, newValue: number | null) => {
        if (newValue !== null) {
            setValue(newValue);
        }
    };

    const review = (reviewData: { ratings: number, comment: string }) => {
        reviewData.ratings = value;
        const url = `http://localhost:3000/api/ratings/add/${idUSer}/${id}`;
        return fetch(url,
            {
                method: 'PUT',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reviewData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('review failed!')
                }
                return response.json()
            }).then(data => {
                if (data.status === 'error') {
                    throw new Error(data.message);
                }
                console.log('Review successful!');
                console.log(reviewData);
            }).catch(error => {
                console.error('error during review: ', error);
            }
            )
    }

    useEffect(() => {
        fetchRatings();
    }, []);

    const fetchRatings = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/ratings/admin/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch admins with logos');
            }
            const ratingData = await response.json();
            setInfoWithReviews(ratingData)
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/user`);
            if (!response.ok) {
                throw new Error('Failed to fetch admins with logos');
            }
            const userData = await response.json();
            const userIds = userData.map((user: UserType) => user.userId);
            setUserIds(userIds);
            const userNick = userData.map((user: UserType) => user.nickname);
            setuserNick(userNick);
        } catch (error) {
            console.error('Error fetching admins:', error);
        }
    };

    function SingleReview({ review }: { review: ReviewType }) {
        for (let i = 0; i <= userIds.length; i++) {
            if (userIds[i] === review.userId) {
                return (
                    <div key={review.ratingId} style={{ marginTop: "15px" }}>
                        <p className="nick">{userNick[i]} :</p>
                        <div style={{display: "flex", alignItems: "center" }}>
                            <div style={{ flexGrow: "1" }}>
                                <textarea
                                    style={{
                                        marginTop: "5px",
                                        width: "100%",
                                        height: "50px",
                                        padding: "8px",
                                        resize: "none",
                                        pointerEvents: "none"
                                    }}
                                    readOnly
                                >
                                    {review.comment}
                                </textarea>
                            </div>
                            <div style={{ padding: "10px", backgroundColor: "#1f2833", borderRadius: "5%" }}>
                                <Rating name="half-rating" value={review.rating} precision={0.5} onChange={setRating} readOnly />
                            </div>
                        </div>
                    </div>
                );
            }
        }
        return null;
    }

    return (
        <>
            {isUser ? (
                <div>
                    <Button className="addreviews" onClick={openPopup}>
                        <p>Dodaj recenziju</p>
                    </Button>
                    {showPopup && (
                        <>
                            <div className="overlay" onClick={closePopup} />
                            <div className="popup-container">
                                <div className="review-container">
                                    <Button className='zatvori'
                                        onClick={closePopup}> X </Button>
                                    <div className="naslov">
                                        <FontAwesomeIcon icon={faComment} /> Dodaj recenziju
                                    </div>
                                    <div className="comment-container">
                                        <textarea className="comment-input" placeholder="Unesite komentar..." onChange={formInputChange} name="comment"></textarea>
                                    </div>
                                    <div className="rating-container" style={{ marginBottom: "10px" }}>
                                        <Rating name="ratings" style={{ borderColor: "white" }} value={value} precision={0.5} onChange={setRating} />
                                    </div>
                                    <Button className="addreviews" onClick={addReview}>
                                        <p>Dodaj recenziju</p>
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div style={{ display: "none" }}>
                    <Button className="addreviews" onClick={openPopup}>
                        <p>Dodaj recenziju</p>
                    </Button>
                </div>
            )}
            <Row>
                <Col md={{ span: 10, offset: 1 }}>
                    {reviwinfo.reviews && reviwinfo.reviews.length > 0 && reviwinfo.reviews.map((review) => (
                        <SingleReview key={review.ratingId} review={review} />))
                    }
                </Col>
            </Row>
        </>
    );
};
export default ReviewsAdmin;