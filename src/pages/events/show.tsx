import { Show, TextField, DateField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const EventShow = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id} />

      <Title level={5}>{"Название"}</Title>
      <TextField value={record?.name} />

      <Title level={5}>{"Описание"}</Title>
      <TextField value={record?.description} />

      <Title level={5}>{"Время начала"}</Title>
      <DateField value={record?.start_time} format="DD.MM.YYYY, HH:mm" />

      <Title level={5}>{"Время окончания"}</Title>
      <DateField value={record?.end_time} format="DD.MM.YYYY, HH:mm" />

      <Title level={5}>{"Место проведения"}</Title>
      <TextField value={record?.location} />
    </Show>
  );
};
