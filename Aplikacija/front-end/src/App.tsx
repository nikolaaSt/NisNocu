import MainMenu from "./Components/MainMenu/MainMenu";
import HomePage from "./Components/HomePage/HomePage";
import Places from "./Components/Places/Places";
import LoginPage from "./Components/LoginPage/LoginPage";
import RegistrationPage from "./Components/RegistrationPage/RegistrationPage";
import { Routes, Route } from "react-router-dom";
import Place from "./Components/Place/Place";
import "./App.scss";
import Footer from "./Conteiners/footer/footer";
import Profile from "./Components/Profile/Profile";
import LogoutPage from "./Components/Logout/Logout";
import UserHomePage from "./Components/HomePage/UserHomePage";
import AdminHomePage from "./Components/HomePage/AdminHomePage";
import SuperAdmin from "./Components/SuperAdminPage/SuperAdmin";
import QrCodePage from "./Components/QrCodePage/QrCodePage";

export default function App() {
  return (
    <div className="app">
      <MainMenu />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/userhomepage" element={<UserHomePage />} />
        <Route path="/adminhomepage" element={<AdminHomePage />} />
        <Route path="/places" element={<Places />} />
        <Route path="/place/:id" element={<Place />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/superadmin" element={<SuperAdmin />} />
        <Route path="/qrcode/:id" element={<QrCodePage />}/>
      </Routes>
      <Footer />
    </div>
  );
}
