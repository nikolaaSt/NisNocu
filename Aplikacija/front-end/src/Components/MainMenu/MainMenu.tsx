import jwtDecode from "jwt-decode";
import "./MainMenu.scss";
import { ReactNode, useEffect, useState } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

interface DecodedToken {
  role: string;
  id: string;
}

export default function MainMenu() {
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [menu, setmenu] = useState(false);

  const handleClick = () => {
    setmenu(!menu);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const decodedUserRole = decodedToken.role;
      const id = decodedToken.id;
      setRole(decodedUserRole);
      setId(id);
    }
  }, []);

  const render = () => {
    if (role === "user") {
      return (
        <nav className="nav">
          <ul className={`mobile-nav ${menu ? 'menuactive' : ''}`}>
            <CustomLink to="/userhomepage">Početna</CustomLink>
            <CustomLink to="/places">Lokali</CustomLink>
            <CustomLink to={`/profile/${id}`}>Profil</CustomLink>
            <CustomLink to="/logout">Odjavi se</CustomLink>
          </ul>
          <div id="mobile" onClick={handleClick}>
            <FontAwesomeIcon icon={menu ? faCircleXmark : faBars} />
          </div>
        </nav>
      );
    } else if (role === "administrator") {
      return (
        <nav className="nav">
          <ul className={`mobile-nav ${menu ? 'menuactive' : ''}`}>
            <CustomLink to="/adminhomepage">Početna</CustomLink>
            <CustomLink to="/places">Lokali</CustomLink>
            <CustomLink to={`/place/${id}`}>Lokal</CustomLink>
            <CustomLink to="/logout">Odjavi se</CustomLink>
          </ul>
          <div id="mobile" onClick={handleClick}>
            <FontAwesomeIcon icon={menu ? faCircleXmark : faBars} />
          </div>
        </nav>
      );
    } else if (role === "superadministrator") {
      return (
        <nav className="nav">
          <ul className={`mobile-nav ${menu ? 'menuactive' : ''}`}>
            <CustomLink to="/">Početna</CustomLink>
            <CustomLink to="/places">Lokali</CustomLink>
            <CustomLink to={`/superadmin`}>SuperAdmin</CustomLink>
            <CustomLink to="/logout">Odjavi se</CustomLink>
          </ul>
          <div id="mobile" onClick={handleClick}>
            <FontAwesomeIcon icon={menu ? faCircleXmark : faBars} />
          </div>
        </nav>
      );
    } else {
      return (
        <nav className="nav">
          <ul className={`mobile-nav ${menu ? 'menuactive' : ''}`}>
            <CustomLink to="/">Početna</CustomLink>
            <CustomLink to="/places">Lokali</CustomLink>
            <CustomLink to="/login">Prijavi se</CustomLink>
            <CustomLink to="/register">Registracija</CustomLink>
          </ul>
          <div id="mobile" onClick={handleClick}>
            <FontAwesomeIcon icon={menu ? faCircleXmark : faBars} />
          </div>
        </nav>
      )
    }
  }

  return render();
}

function CustomLink({ to, children, ...props }: { to: string, children: ReactNode }) {
  const resolvePath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvePath.pathname, end: true });
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  );
}
