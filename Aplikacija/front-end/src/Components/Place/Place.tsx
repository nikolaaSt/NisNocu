import { useParams } from "react-router-dom";
import MyCarousel from "../Carousel/MyCarousel";
import "./Place.scss";
import { useState } from "react";
import InfoCard from "../InfoCard/InfoCard";
import ContentCard from "../ContentCard/ContentCard";

const Place = () => {
  return (
    <div className="place__card">
      <MyCarousel />
      <section className="place">
        <InfoCard type="place" />
        <ContentCard type="place" />
      </section>
    </div>
  );
};

export default Place;
