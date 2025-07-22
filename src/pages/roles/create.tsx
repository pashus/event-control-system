import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import { useParams } from "react-router";

export const RoleCreate = () => {
  const { eventId } = useParams();

  const { formProps, saveButtonProps, formLoading, onFinish } = useForm({
    onMutationSuccess: (data, variables) => {
      console.log("ОТПРАВИЛОСЬ: ", { data, variables });
    },
    onMutationError: (data, variables) => {
      console.log("НЕ ОТПРАВИЛОСЬ: ", { data, variables });
    },
    successNotification: (data) => {
      return {
        message: `Активность ${data?.data.name} успешно добавлена`,
        type: "success",
      };
    },
    errorNotification: () => {
      return {
        message: "Ошибка при добавлении активности",
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

  // const handleOnFinish = (values: any) => {
  //   onFinish({
  //     data: {
  //
  //     },
  //   });
  // };

  return (
    <Create saveButtonProps={saveButtonProps} isLoading={formLoading}>
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
      </Form>
    </Create>
  );
};
