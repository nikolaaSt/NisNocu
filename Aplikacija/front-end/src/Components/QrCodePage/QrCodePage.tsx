import { useEffect, useState } from "react";
import QrCodeType from "../../types/QrCodeType";
import { useParams } from "react-router-dom";
import { ApiConfig } from "../../config/api.config";
import "./QrCodePage.scss";

const QrCodePage = () => {
  const { id } = useParams();
  const [qrcodes, setqrcodes] = useState<QrCodeType[]>([]);

  useEffect(() => {
    fetchLogos();
  }, []);

  const fetchLogos = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/qrcode/");
      if (!response.ok) {
        throw new Error("Failed to fetch admins with qrcode");
      }

      const qrcodeData = await response.json();
      const qrcodes = qrcodeData.filter(
        (qrcode: QrCodeType) => qrcode.reservationId?.toString() === id
      );
      setqrcodes(qrcodes);
    } catch (error) {
      console.error("Error fetching qrcode:", error);
    }
  };
  console.log(qrcodes);
  return (
    <>
      <section className="qr-container">
        {qrcodes.map((qrcode) => (
          <img
            key={qrcode.reservationId}
            className="image"
            src={ApiConfig.PHOTO_PATH + qrcode.qrPath}
            alt="Logo"
          />
        ))}
      </section>
    </>
  );
};

export default QrCodePage;
