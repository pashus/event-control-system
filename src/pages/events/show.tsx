import { CalendarOutlined } from "@ant-design/icons";
import {
  Show,
  TextField,
  DateField,
  DeleteButton,
  EditButton,
  ListButton,
} from "@refinedev/antd";
import { useNavigation, useShow } from "@refinedev/core";
import { Button, Typography } from "antd";

const { Title } = Typography;

export const EventShow = () => {
  const { query } = useShow();
  const { data, isLoading } = query;

  const record = data?.data;

  const { push } = useNavigation();

  return (
    <Show
      title={`Мероприятие: ${record?.name}`}
      isLoading={isLoading}
      headerButtons={({
        deleteButtonProps,
        editButtonProps,
        listButtonProps,
      }) => (
        <>
          {listButtonProps && (
            <ListButton icon={<CalendarOutlined />} {...listButtonProps} />
          )}
          {editButtonProps && <EditButton {...editButtonProps} />}
          {deleteButtonProps && <DeleteButton {...deleteButtonProps} />}
        </>
      )}
      footerButtons={() => (
        <>
          <Button
            onClick={() => push(`/events/${record?.id}/players`)}
            color="purple"
            variant="outlined"
          >
            Участники
          </Button>
          <Button color="geekblue" variant="outlined">
            Форма на регистрацию
          </Button>
          <Button
            onClick={() => push(`/events/${record?.id}/activities`)}
            color="pink"
            variant="outlined"
          >
            Активности
          </Button>
          <Button
            onClick={() => push(`/events/${record?.id}/roles`)}
            color="purple"
            variant="outlined"
          >
            Роли
          </Button>
        </>
      )}
    >
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

      {/* <Space>
        <Button>Участники</Button>
        <Button>Участники</Button>
        <Button>Участники</Button>
        <Button>Участники</Button>
      </Space> */}
    </Show>
  );
};
