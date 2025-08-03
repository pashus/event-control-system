import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { Card, Typography, Space } from "antd";
import { useNotification } from "@refinedev/core";
import { api } from "@/api";

const { Text } = Typography;

export const QrScanner = () => {
  const [response, setResponse] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { open } = useNotification();

  useEffect(() => {
    startScanner();
  }, []);

  const startScanner = () => {
    /**
     * Тут попытаться перевести текст
     */
    setTimeout(() => {
      const btnPerm = document.querySelector(
        "#html5-qrcode-button-camera-permission"
      );
      if (btnPerm) {
        btnPerm.textContent = "Запросите разрешение на использование камеры";
      }
    }, 0);

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: { width: 250, height: 250 },
        fps: 20,
      },
      false
    );

    scanner.render(
      async (decodedText) => {
        try {
          const checkInEndpoint = decodedText;
          console.log(checkInEndpoint);
          await api.post(checkInEndpoint);

          setResponse("Участник отмечен");
          open?.({ type: "success", message: "Участник отмечен" });
        } catch (error: any) {
          const message =
            error?.response?.data?.error || "Ошибка при сканировании";
          open?.({ type: "error", message });
          setResponse("Ошибка");
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
      () => {
        // ничего
      }
    );
  };

  return (
    <Card
      title="Сканер QR-кодов"
      style={{ maxWidth: "650px", margin: "24px auto" }}
    >
      <Text>Отсканируйте QR-код</Text>
      <div id="reader" style={{ width: "100%", marginTop: 16 }} />
      <Space direction="vertical" style={{ marginTop: 0 }}>
        {response && (
          <Text type={response === "Ошибка" ? "danger" : "success"}>
            {response}
          </Text>
        )}
        {countdown !== 0 && (
          <Text type="secondary">
            Повторное сканирование через {countdown}...
          </Text>
        )}
      </Space>
    </Card>
  );
};
