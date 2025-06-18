import { Card, CardContent, Typography } from "@mui/material";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { Title, useNotify } from "react-admin";
import { dataProvider } from "../../api/data-provider";

function QRScanner() {
  const [response, setResponse] = useState("");
  const [countdown, setCountdown] = useState(0);
  const notify = useNotify();

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
      async (decodedText) => {
        try {
          await dataProvider.create(decodedText.slice(0, -1), {
            data: {},
          });
          setResponse(`Успешно`);
          notify("Участник отмечен", { type: "success" });
        } catch (error: any) {
          notify(`${error.body.error}`, { type: "error" });
        }

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
      () => {},
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
