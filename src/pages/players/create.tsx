import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import { useParams } from "react-router";

export const PlayerCreate = () => {
  const { eventId } = useParams();

  const { formProps, saveButtonProps, formLoading, onFinish } = useForm({
    // onMutationSuccess: (data, variables) => {
    //   console.log("ОТПРАВИЛОСЬ: ", { data, variables });
    // },
    // onMutationError: (data, variables) => {
    //   console.log("НЕ ОТПРАВИЛОСЬ: ", { data, variables });
    // },
    successNotification: (data) => {
      return {
        message: `Участник ${data?.data.first_name} ${data?.data.last_name} успешно добавлен`,
        type: "success",
      };
    },
    errorNotification: () => {
      return {
        message: "Ошибка при добавлении участника",
        type: "error",
      };
    },
    meta: {
      parent: {
        resource: "events",
        id: eventId,
      },
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
