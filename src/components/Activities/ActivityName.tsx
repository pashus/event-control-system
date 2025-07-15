import { useGetOne } from "react-admin";

export function ActivityName({
  eventId,
  activityId,
}: {
  eventId: string | number;
  activityId: string | number;
}) {
  const { data, isLoading } = useGetOne(`events/${eventId}/activities`, {
    id: activityId,
  });

  if (isLoading) return <span>Загрузка...</span>;
  if (!data) return <span>Не найдена</span>;

  return <span>{data.name}</span>;
}
