import { useState } from "react";
import InfoTypes from "../../enums/InfoCard";
import "./ContentCard.scss";
import ContentAdmin from "./ContentAdmin";
import ContentUser from "./ContentUser";
import ReviewsAdmin from "./ReviewsAdmin";
import ReviewsUser from "./ReviewsUser";

const ContentCard = (props: { type: string }) => {
  const [showReviews, setShowReviews] = useState(false);
  const [activeDiv, setActiveDiv] = useState("events");

  const renderContent = () => {
    if (showReviews) {
      if (props.type === "place") {
        return (
          <div className="content__reviews u-soft-edges">
            <ReviewsAdmin />
          </div>
        );
      } else {
        return (
          <div className="content__reviews u-soft-edges">
            <ReviewsUser />
          </div>
        );
      }
    } else {
      if (props.type === "place") {
        return (
          <div className="content__events u-soft-edges">
            <ContentAdmin />
          </div>
        );
      } else {
        return (
          <div className="content__events u-soft-edges">
            <ContentUser />
          </div>
        );
      }
    }
  };

  return (
    <div className="place__content u-soft-edges">
      <div className="content__nav u-soft-edges">
        <div
          className={`content__nav-item u-soft-edges ${
            activeDiv === "events" ? "active" : ""
          }`}
          onClick={() => {
            setShowReviews(false);
            setActiveDiv("events");
          }}
        >
          {props.type === InfoTypes.Place && "Događaji"}
          {props.type === InfoTypes.Profile && "Rezervacije"}
        </div>
        <div
          className={`content__nav-item u-soft-edges ${
            activeDiv === "reviews" ? "active" : ""
          }`}
          onClick={() => {
            setShowReviews(true);
            setActiveDiv("reviews");
          }}
        >
          Ocene
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default ContentCard;
