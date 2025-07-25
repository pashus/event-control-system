import { Create, useForm } from "@refinedev/antd";
import { Form, Input } from "antd";
import { useParams } from "react-router";

export const RegistrationForm = () => {
    const { eventId } = useParams();
    const { formProps, saveButtonProps, formLoading } = useForm({
        resource: "players",
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
        onMutationSuccess: (data) => {
            formProps.form?.resetFields();
        },
    });

    return (
        <Create
            title="Регистрация на мероприятие"
            saveButtonProps={saveButtonProps}
            isLoading={formLoading}
        >
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
