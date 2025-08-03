import { useParams } from "react-router";
import { VolunteerScanner } from "./scanner";
import { useOne } from "@refinedev/core";
import { Alert, Spin, Typography } from "antd";

const { Title } = Typography;

export const VolunteerActivityPage = () => {
  const { eventId } = useParams();

  const { data, isLoading, error } = useOne({
    resource: "events",
    id: eventId,
  });

  if (!eventId) {
    return <div>Ошибка: мероприятие не выбрано</div>;
  }

  if (isLoading) {
    return <Spin />;
  }

  if (error) {
    return (
      <Alert
        message="Такого мероприятия нет или произошла ошибка загрузки"
        type="error"
      />
    );
  }

  const event = data?.data;

  return (
    <>
      <Title level={2} style={{ textAlign: "center" }}>
        Волонтёрская активность для мероприятия <b>{event?.name}</b>
      </Title>
      <VolunteerScanner eventId={eventId} />
    </>
  );
};
