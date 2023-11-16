import { useState, useEffect } from "react";
import UserType from "../../../types/UserType";
import { useParams } from "react-router-dom";


const ProfileInfo = () => {
  const { id } = useParams();
  const [users, setUser] = useState<UserType[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/user');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const user = users.find((user) => user.userId?.toString() === id);
  const userNick = user ? user.nickname : 'Unknown';
  const userForename = user ? user.forename : 'Unknown';
  const userSurname = user ? user.surname : 'Unknown';
  const userPhone = user ? user.phoneNumber : 'Unknown';

  return (
    <div>
      <li className="info-list__list-item username">{userNick} </li>
      <li className="info-list__list-item">{userForename} {userSurname} </li>
      <li className="info-list__list-item">{userPhone} </li>
    </div>
  );
};

export default ProfileInfo;