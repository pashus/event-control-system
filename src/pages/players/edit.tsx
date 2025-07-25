import { Edit, useForm } from "@refinedev/antd";
import { useOne } from "@refinedev/core";
import { Form, Input } from "antd";
import { useParams } from "react-router";

export const PlayerEdit = () => {
  const { eventId } = useParams();

  const { formProps, saveButtonProps, formLoading } = useForm({
    // onMutationSuccess: (data, variables) => {
    //   console.log("ОТПРАВИЛОСЬ: ", { data, variables });
    // },
    // onMutationError: (data, variables) => {
    //   console.log("НЕ ОТПРАВИЛОСЬ: ", { data, variables });
    // },
    successNotification: (data) => {
      return {
        message: `Участник ${data?.data.first_name} ${data?.data.last_name} успешно отредактирован`,
        type: "success",
      };
    },
    errorNotification: () => {
      return {
        message: "Ошибка при редактировании участника",
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
    <Edit
      saveButtonProps={{ ...saveButtonProps }}
      isLoading={formLoading}
      headerButtons={() => <></>}
    >
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
          label={"ID роли"}
          name="role_id"
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
