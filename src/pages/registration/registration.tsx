import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Typography } from "antd";
import { useParams } from "react-router";

const { Title } = Typography;

export const RegistrationForm = () => {
  const { eventId } = useParams();

  const { formProps, saveButtonProps, formLoading } = useForm({
    resource: `registration`,
    redirect: false,
    successNotification: () => ({
      message: `Вы успешно зарегистрировались`,
      type: "success",
    }),
    errorNotification: () => ({
      message: "Ошибка при регистрации",
      type: "error",
    }),
    meta: {
      parent: {
        resource: "events",
        id: eventId,
      },
    },
    onMutationSuccess: () => {
      formProps.form?.resetFields();
    },
  });

  // const { data: eventData, isLoading } = useOne({
  //   resource: "events",
  //   id: eventId,
  // });
  // const eventTitle = eventData?.data.name;

  // if (isLoading) {
  //   return (
  //     <div style={{ textAlign: "center", padding: "40px 0" }}>
  //       <Spin size="large" tip="Загрузка мероприятия..." />
  //     </div>
  //   );
  // }

  // if (!eventTitle) {
  //   return (
  //     <Title level={4} style={{ textAlign: "center", color: "#ff4d4f" }}>
  //       Мероприятие не найдено
  //     </Title>
  //   );
  // }

  return (
    <Create
      title={false}
      goBack={false}
      headerButtons={false}
      saveButtonProps={{
        ...saveButtonProps,
        children: "Зарегистрироваться",
        icon: false,
      }}
      isLoading={formLoading}
      contentProps={{
        style: {
          maxWidth: "650px",
          margin: "0 auto",
          width: "100%",
        },
      }}
    >
      <Title level={4} style={{ marginBottom: "24px" }}>
        {`Регистрация на мероприятие`}
      </Title>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Имя"
          name="first_name"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите имя",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Фамилия"
          name="last_name"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите фамилию",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Номер группы"
          name="group_name"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите номер группы",
            },
          ]}
        >
          <Input placeholder="РИ-123456" />
        </Form.Item>
      </Form>
    </Create>
  );
};
