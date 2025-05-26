import {
    required,
    useRecordContext,
    List,
    Datagrid,
    TextField,
    Edit,
    SimpleForm,
    TextInput,
    Create,
    TopToolbar,
    CreateButton,
    ExportButton,
    Show,
    SimpleShowLayout,
    NumberField,
} from 'react-admin';

function UserListActions() {
    return (
        <TopToolbar>
            <CreateButton label='Добавить пользователя' />
            <ExportButton />
        </TopToolbar>
    );
}

function UserShowEditTitle() {
    const record = useRecordContext<{ fullName?: string }>();
    return <span>Пользователь {record?.fullName ?? ''}</span>;
};

export function UserList() {
    return (
        <List actions={<UserListActions />} title="Пользователи" perPage={50}>
            <Datagrid
                size='medium'
            >
                <TextField source="id" label="ID" />
                <TextField source="username" label="Имя" />
            </Datagrid>
        </List>
    )
}

export function UserShow() {
    return (
        <Show title={<UserShowEditTitle />}>
            <SimpleShowLayout>
                <TextField source="username" label="Имя" />
            </SimpleShowLayout>
        </Show>
    );
}

export function UserEdit() {
    return (
        <Edit title={<UserShowEditTitle />}>
            <SimpleForm>
                <TextInput
                    source="username"
                    label="Имя"
                    validate={required()}
                />
            </SimpleForm>
        </Edit>
    )
}

export function UserCreate() {
    return (
        <Create redirect="list" title="Добавить пользователя">
            <SimpleForm>
                <TextInput
                    source="username"
                    label="Полное имя"
                    validate={required()}
                />
                <TextInput
                    source="password"
                    label="Пароль"
                    validate={required()}
                />
            </SimpleForm>
        </Create>
    )
}
