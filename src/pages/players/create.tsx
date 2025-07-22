import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const PlayerCreate = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    successNotification: (data) => {
      return {
        message: `Участник ${data?.data.username} успешно добавлен`,
        type: "success",
      };
    },
    errorNotification: () => {
      return {
        message: "Ошибка при добавлении участника",
        type: "error",
      };
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Имя"}
          name="first_name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Фамилия"}
          name="last_name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Номер группы"}
          name="group_name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"ID Роли"}
          name="role_id"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        {/* <Form.Item label={"Email"} name="email">
          <Input type="email" />
        </Form.Item> - если будет */}
      </Form>
    </Create>
  );
};
