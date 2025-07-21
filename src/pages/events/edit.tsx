import { Edit, useForm } from "@refinedev/antd";
import { DatePicker, Form, Input } from "antd";
import dayjs from "dayjs";

export const EventEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    successNotification: (data) => {
      return {
        message: `Мероприятие ${data?.data.name} успешно отредактировано`,
        type: "success",
      };
    },
    errorNotification: () => {
      return {
        message: "Ошибка при редактировании мероприятия",
        type: "error",
      };
    },
  });

  return (
    <Edit saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Название"}
          name="name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Описание"}
          name="description"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea autoSize={{ minRows: 4 }} />
        </Form.Item>
        <Form.Item
          label={"Время начала"}
          name="start_time"
          getValueProps={(value) => ({
            value: value ? dayjs(value) : null,
          })}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item
          label={"Время окончания"}
          name="end_time"
          getValueProps={(value) => ({
            value: value ? dayjs(value) : null,
          })}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item
          label={"Место проведения"}
          name="location"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
};
