import { useEffect, useState } from "react";
import ContentCard from "../ContentCard/ContentCard";
import InfoCard from "../InfoCard/InfoCard";
import "./Profile.scss";
import jwtDecode from "jwt-decode";

interface DecodedToken {
 id: string;
}

const Profile = () => {
  
  const [id, setId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const decodedUserId = decodedToken.id;
      setId(decodedUserId);
    }
  }, []);
  console.log(id);
  return (
    <section className="profile">
      <InfoCard type="profile" />
      <ContentCard type="profile" />
    </section>
  );
};

export default Profile;
