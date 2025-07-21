import { Show, TextField } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title } = Typography;

export const UserShow = () => {
  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;

  const record = data?.data;

  //пока убрать кнопку
  return (
    <Show
      title={`Пользователь: ${record?.username}`}
      isLoading={isLoading}
      canEdit={false}
    >
      <Title level={5}>{"ID"}</Title>
      <TextField value={record?.id} />

      <Title level={5}>{"Имя пользователя"}</Title>
      <TextField value={record?.username} />

      <Title level={5}>{"Почта"}</Title>
      <TextField value={record?.email || "-"} />
    </Show>
  );
};
