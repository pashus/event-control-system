import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { Card, Typography, Space, Select } from "antd";
import { useNotification } from "@refinedev/core";
import { api } from "@/api";
import { ActivityVariableSelector } from "./activity-variable-selector";
import { IActivity } from "@/types";
import { actionsByType } from "@/constants";

const { Text, Title } = Typography;

export const VolunteerScanner = ({ eventId }: { eventId: string }) => {
  const [response, setResponse] = useState("");
  const [countdown, setCountdown] = useState(0);
  const { open } = useNotification();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const isProcessingRef = useRef(false);

  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string>();
  const [selectedActivity, setSelectedActivity] = useState<IActivity>();
  const [selectedVariable, setSelectedVariable] = useState<{
    name: string;
    type: string;
  } | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | undefined>();

  // получение активностей
  useEffect(() => {
    api
      .get(`/events/${eventId}/activities/`)
      .then((response) =>
        setActivities(Array.isArray(response.data) ? response.data : [])
      )
      .catch(() =>
        open?.({ type: "error", message: "Ошибка загрузки активностей" })
      );
  }, [eventId]);

  useEffect(() => {
    setSelectedActivity(
      selectedActivityId
        ? activities.find((a) => a.id === selectedActivityId)
        : undefined
    );
    setSelectedVariable(null);
    setSelectedAction(undefined);
  }, [selectedActivityId, activities]);

  const handlePlayerScan = async (playerId: string) => {
    const activityId = selectedActivity?.id;
    const variableName = selectedVariable?.name;
    const varType = selectedVariable?.type;

    if (isProcessingRef.current) {
      return;
    }
    isProcessingRef.current = true;

    try {
      // получить act_vars участника для этой активности
      const { data: actVarsData } = await api.get(
        `events/10/players/1/vars/${activityId}/`
      );
      const actVars = actVarsData.act_vars || [];
      console.log(`Переменные у участника ${actVars}`);

      // найти нужную переменную
      const idx = actVars.findIndex(([n]: [string]) => n === variableName);
      if (idx === -1) throw new Error("Переменная не найдена у участника!");

      // работа с int
      if (varType === "int") {
        const val = Number(actVars[idx][1]);
        if (isNaN(val)) throw new Error("Значение не число");

        switch (selectedAction) {
          case "check":
            open?.({
              type: "success",
              message: `${variableName}: ${val}`,
            });
            setResponse(`Значение: ${val}`);
            break;

          case "increase":
            actVars[idx][1] = val + 1;
            await api.post(`events/10/players/1/vars/${activityId}/`, {
              act_vars: actVars,
            });
            open?.({
              type: "success",
              message: `${variableName}: ${val} → ${val + 1}`,
            });
            setResponse(`Новое значение: ${val + 1}`);
            break;

          case "decrease":
            actVars[idx][1] = val - 1;
            await api.post(`events/10/players/1/vars/${activityId}/`, {
              act_vars: actVars,
            });
            open?.({
              type: "success",
              message: `${variableName}: ${val} → ${val - 1}`,
            });
            setResponse(`Новое значение: ${val - 1}`);
            break;

          default:
            throw new Error("Неизвестное действие");
        }
      }
      // работа с bool
      else if (varType === "bool") {
        setResponse(`Значение: ${actVars[idx][1] ? "Да" : "Нет"}`);
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.error || err.message || "Ошибка при обработке";
      open?.({ type: "error", message: message });
      setResponse("Ошибка");
    } finally {
      isProcessingRef.current = false;
    }
  };

  // QR scanner
  const startScanner = () => {
    if (scannerRef.current) return; // не запускать второй раз
    setTimeout(() => {
      const btnPerm = document.querySelector(
        "#html5-qrcode-button-camera-permission"
      );
      if (btnPerm)
        btnPerm.textContent = "Запросите разрешение на использование камеры";
    }, 0);

    const scanner = new Html5QrcodeScanner(
      "reader",
      { qrbox: { width: 250, height: 250 }, fps: 20 },
      false
    );

    scannerRef.current = scanner;

    scanner.render(
      async (decodedText) => {
        if (isProcessingRef.current) {
          return;
        }
        await handlePlayerScan(decodedText);

        scanner.clear().then(() => {
          scannerRef.current = null;
          let seconds = 3;
          setCountdown(seconds);
          const interval = setInterval(() => {
            seconds -= 1;
            if (seconds === 0) {
              clearInterval(interval);
              setCountdown(0);
              setResponse("");
              isProcessingRef.current = false;
              startScanner();
            } else {
              setCountdown(seconds);
            }
          }, 1000);
        });
      },
      () => {
        //
      }
    );
  };

  // автостарт QR после выбора всего
  useEffect(() => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }

    if (selectedActivity && selectedVariable && selectedAction) {
      startScanner();
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [selectedActivity, selectedVariable, selectedAction]);

  return (
    <Card
      title="Сканер для волонтёров"
      style={{ maxWidth: "650px", margin: "24px auto" }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <div>
          <Title level={5}>Выберите активность:</Title>
          <Select
            style={{ width: "100%" }}
            placeholder="Активность"
            value={selectedActivityId}
            onChange={setSelectedActivityId}
            options={activities.map((activity) => ({
              value: activity.id,
              label: activity.name,
            }))}
          />
        </div>

        {!!selectedActivity && (
          <ActivityVariableSelector
            activity={selectedActivity}
            onVariableChange={setSelectedVariable}
          />
        )}

        {!!selectedVariable && (
          <div>
            <Title level={5} style={{ marginTop: 16 }}>
              Выберите действие:
            </Title>
            <Select
              style={{ width: "100%" }}
              placeholder="Действие"
              value={selectedAction}
              onChange={setSelectedAction}
              options={actionsByType[selectedVariable.type] || []}
            />
          </div>
        )}

        {!!selectedVariable && !!selectedAction && (
          <>
            <Text>Отсканируйте QR-код участника</Text>
            <div id="reader" style={{ width: "100%", marginTop: 16 }} />
          </>
        )}

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
