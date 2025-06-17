import { Card, CardContent, Typography } from "@mui/material";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { Title } from "react-admin";

function QRScanner() {
  const [response, setResponse] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    startScanner();
  }, []);

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: { width: 250, height: 250 },
        fps: 20,
      },
      false,
    );

    scanner.render(
      () => {
        setResponse("Успешно");
        scanner.clear().then(() => {
          let seconds = 3;
          setCountdown(seconds);

          const interval = setInterval(() => {
            seconds -= 1;
            if (seconds === 0) {
              clearInterval(interval);
              setCountdown(0);
              setResponse("");
              startScanner();
            } else {
              setCountdown(seconds);
            }
          }, 1000);
        });
      },
      (err) => {
        console.log(err);
        let seconds = 3;
        setResponse("Ошибка");
        setCountdown(seconds);

        const interval = setInterval(() => {
          seconds -= 1;
          if (seconds === 0) {
            clearInterval(interval);
            setCountdown(0);
            setResponse("");
            startScanner();
          } else {
            setCountdown(seconds);
          }
        }, 1000);
      },
    );
  };

  return (
    <Card sx={{ width: "60%", mx: "auto", mt: 4, p: 2 }}>
      <Title title="Сканер QR-кодов" />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Отсканируйте QR-код
        </Typography>
        <div id="reader" style={{ width: "100%", margin: "0 auto" }} />
        {response && (
          <div style={{ marginTop: "20px" }}>
            <Typography
              sx={{
                color: response === "Ошибка" ? "error.main" : "success.main",
              }}
              variant="body1"
            >
              {response}
            </Typography>
          </div>
        )}
        {countdown !== 0 && (
          <Typography variant="caption">
            Повторное сканирование через {countdown}...
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default QRScanner;
