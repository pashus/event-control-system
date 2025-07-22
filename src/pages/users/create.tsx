import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const UserCreate = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    // onMutationSuccess: (data, variables) => {
    //   console.log("ОТПРАВИЛОСЬ: ", { data, variables });
    // },
    // onMutationError: (data, variables) => {
    //   console.log("НЕ ОТПРАВИЛОСЬ: ", { data, variables });
    // },
    successNotification: (data) => {
      return {
        message: `Пользователь ${data?.data.username} успешно добавлен`,
        type: "success",
      };
    },
    errorNotification: () => {
      return {
        message: "Ошибка при добавлении пользователя",
        type: "error",
      };
    },
  });

  return (
    <Create saveButtonProps={saveButtonProps} isLoading={formLoading}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Имя пользователя"}
          name="username"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Пароль"}
          name="password"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        {/* <Form.Item label={"Email"} name="email">
          <Input type="email" />
        </Form.Item> - если будет */}
      </Form>
    </Create>
  );
};
