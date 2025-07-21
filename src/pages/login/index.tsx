import { useLogin } from "@refinedev/core";
import { Button, Card, Form, Input, theme, Typography } from "antd";

const { Title } = Typography;

export const Login = () => {
  const { token } = theme.useToken();
  const { mutate: login, isLoading } = useLogin();

  const onFinish = (values: { username: string; password: string }) => {
    login(values);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: token.colorBgBase,
      }}
    >
      <Card
        style={{ width: 300, backgroundColor: token.colorBgElevated }}
        bodyStyle={{ padding: 24 }}
      >
        <Title level={3} style={{ textAlign: "center" }}>
          Вход
        </Title>
        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="username"
            label="Имя пользователя"
            rules={[{ required: true, message: "Введите имя пользователя" }]}
          >
            <Input size="large" placeholder="Введите имя пользователя" />
          </Form.Item>

          <Form.Item //Тут поправить чтобы было нормальное автозаполнение
            name="password"
            label="Пароль"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password size="large" placeholder="Введите пароль" />
          </Form.Item>

          <Button
            size="large"
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
          >
            Войти
          </Button>
        </Form>
      </Card>
    </div>
  );
};
