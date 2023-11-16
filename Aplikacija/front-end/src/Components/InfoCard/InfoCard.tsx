import { useParams } from "react-router-dom";
import img from "../../assets/avatar.svg";
import InfoTypes from "../../enums/InfoCard";
import "./InfoCard.scss";
import PlaceInfo from "./PlaceInfo/PlaceInfo";
import ProfileInfo from "./ProfileInfo/ProfileInfo";
import jwtDecode from "jwt-decode";
import { ApiConfig } from "../../config/api.config";
import { useEffect, useState } from "react";
import AddPhotos from "./AddPhotos";
import LogoType from "../../types/LogoType";

interface DecodedToken {
  role: string;
  id: number;
}

const InfoCard = (props: { type: string }) => {
  const { id } = useParams();
  const [adminLogos, setAdminLogos] = useState<LogoType[]>([]);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/logos/');
      if (!response.ok) {
        throw new Error('Failed to fetch admins with logos');
      }

      const logoData = await response.json();
      const adminLogos = logoData.filter((adminLogo: LogoType) => adminLogo.administratorId?.toString() === id);
      setAdminLogos(adminLogos);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const renderProps = () => {
    if (props.type === InfoTypes.Place) {
      return <PlaceInfo />;
    } else if (props.type === InfoTypes.Profile) {
      return <ProfileInfo />;
    }
    else {
      return null;
    }
  };

  const token = localStorage.getItem("token");
  let role;
  let ids;
  if (token) {
    const decodedToken = jwtDecode<DecodedToken>(token);
    role = decodedToken.role;
    ids = decodedToken.id
  }

  if (role == "administrator" && ids == id && props.type === InfoTypes.Place) {
    return (
      <div className="info-card">
        {adminLogos.map((adminLogo) => (
          <img key={adminLogo.administratorId} className="logo_place" src={ApiConfig.LOGO_PATH + adminLogo.logoPath} alt="Logo" />))}
        <ul className="info-card__info-list">{renderProps()}</ul>
        <AddPhotos />
      </div>
    );
  } else if (role == "superadministrator" && props.type === InfoTypes.Place) {
    return (
      <div className="info-card">
        {adminLogos.map((adminLogo) => (
          <img key={adminLogo.administratorId} className="logo_place" src={ApiConfig.LOGO_PATH + adminLogo.logoPath} alt="Logo" />))}
        <ul className="info-card__info-list">{renderProps()}</ul>
        <AddPhotos />
      </div>
    );
  } else if (role == "user" && ids == id && props.type === InfoTypes.Profile) {
    return (
      <div className="info-card">
        <img className="info-card__logo" src={img} alt="slika" />
        <ul className="info-card__info-list">{renderProps()}</ul>
      </div>
    );
  } else if (props.type === InfoTypes.Place) {
    return (
      <div className="info-card">
        {adminLogos.map((adminLogo) => (
          <img key={adminLogo.administratorId} className="logo_place" src={ApiConfig.LOGO_PATH + adminLogo.logoPath} alt="Logo" />))}
        <ul className="info-card__info-list">{renderProps()}</ul>
      </div>
    );
  } else {
    return (
      <div className="info-card">
        <img className="info-card__logo" src={img} alt="slika" />
        <ul className="info-card__info-list">{renderProps()}</ul>
      </div>
    );
  }
};

export default InfoCard;
