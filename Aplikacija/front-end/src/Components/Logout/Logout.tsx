import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function removeTokenData() {
  localStorage.removeItem('token');
}

const LogoutPage: React.FC = () => {
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const reloadPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    doLogout();
  }, []);

  const finished = () => {
    setDone(true);
  };

  const doLogout = () => {
    removeTokenData();
    finished();
  };

  if (done) {
    navigate('/login');
    reloadPage();
  }

  return <p>Logging out...</p>;
};

export default LogoutPage;