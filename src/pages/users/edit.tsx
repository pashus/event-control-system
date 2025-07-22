import { Edit, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";

export const UserEdit = () => {
  const { formProps, saveButtonProps, formLoading } = useForm({
    successNotification: (data) => {
      return {
        message: `Пользователь ${data?.data.username} успешно отредактирован`,
        type: "success",
      };
    },
    errorNotification: () => {
      return {
        message: "Ошибка при редактировании пользователя",
        type: "error",
      };
    },
  });

  //пока отключить кнопку
  return (
    <Edit
      saveButtonProps={{ ...saveButtonProps, disabled: true }}
      isLoading={formLoading}
      headerButtons={() => <></>}
    >
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
      </Form>
    </Edit>
  );
};
