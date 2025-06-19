import { useState } from 'react';
import { useParams} from "react-router-dom";
import {
    List,
    Datagrid,
    TextField,
    useGetOne,
    Button,
    useNotify,
    useRefresh,
    useDataProvider,
    SimpleForm,
    TextInput,
    required,
    TopToolbar,
    FunctionField,
    Show,
    SimpleShowLayout,
    ArrayInput,
    SimpleFormIterator
} from 'react-admin';
import { Dialog, DialogTitle, DialogContent, Box } from '@mui/material';

export function EventRolesList() {
    const { id } = useParams();
    const { data: event } = useGetOne("events", { id });

    if (!id) return null;

    return (
        <List
            resource={`events/${id}/roles`}
            title={`Роли мероприятия: ${event?.name || ''}`}
            actions={<RolesListActions eventId={id}/>}
        >
            <Datagrid rowClick="show">
                <TextField source="id" label="ID" />
                <TextField source="name" label="Название роли" />
                <FunctionField
                    label="Активности"
                    render={(record: { activities_values?: Array<any> }) => 
                        record.activities_values?.length || 0
                    }
                />
            </Datagrid>
        </List>
    );
}

const RolesListActions = ({ eventId }: { eventId: string }) => {
    return (
        <TopToolbar>
            <AddRoleButton eventId={eventId} />
        </TopToolbar>
    );
};

const AddRoleButton = ({ eventId }: { eventId: string }) => {
    const [open, setOpen] = useState(false);
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const handleSubmit = async (data: any) => {
        try {
            const postData = {
                name: data.name,
                activities_values: data.activities?.map((activity: any) => ({
                    name: activity.name,
                    act_vars: activity.vars ? Object.entries(activity.vars).map(([key, val]) => [key, val]) : []
                })) || [] 
            };

            await dataProvider.create(`events/${eventId}/roles`, {
                data: postData,
            });

            notify("Роль успешно добавлена", { type: "success" });
            refresh();
            setOpen(false);
        } catch (error: any) {
            notify(`Ошибка при добавлении роли: ${error.message}`, { 
                type: "error",
                undoable: false 
            });
            console.error("Ошибка добавления роли:", error);
        }
    };

    return (
        <>
            <Button 
                onClick={() => setOpen(true)}
            >
                Добавить роль
            </Button>
            
            <Dialog 
                open={open} 
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Добавить новую роль</DialogTitle>
                <DialogContent>
                    <SimpleForm onSubmit={handleSubmit} toolbar={false}>
                        <TextInput 
                            source="name" 
                            label="Название роли" 
                            fullWidth
                            validate={required()}
                        />
                        
                        <ArrayInput 
                            source="activities" 
                            label="Активности роли"
                            defaultValue={[]}
                        >
                            <SimpleFormIterator>
                                <TextInput 
                                    source="name" 
                                    label="Название активности"
                                    validate={required()}
                                    fullWidth
                                />
                                
                                <ArrayInput 
                                    source="vars" 
                                    label="Переменные активности"
                                    defaultValue={{}}
                                >
                                    <SimpleFormIterator inline>
                                        <TextInput 
                                            source="name" 
                                            label="Имя переменной"
                                            validate={required()}
                                        />
                                        <TextInput 
                                            source="value" 
                                            label="Значение"
                                            validate={required()}
                                        />
                                    </SimpleFormIterator>
                                </ArrayInput>
                            </SimpleFormIterator>
                        </ArrayInput>

                        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                            <Button 
                                onClick={() => setOpen(false)}
                                color="secondary"
                            >
                                Отмена
                            </Button>
                            <Button 
                                type="submit" 
                                variant="contained"
                                color="primary"
                                sx={{
                                    backgroundColor: '#FF8C00',
                                    '&:hover': { backgroundColor: '#FF6A00' }
                                }}
                            >
                                Сохранить
                            </Button>
                        </Box>
                    </SimpleForm>
                </DialogContent>
            </Dialog>
        </>
    );
}


export const RoleShow = () => {
    const { id, role_id } = useParams();
    const {
        data: role,
        isLoading,
    } = useGetOne(`events/${id}/roles`, { id: role_id });

    if (isLoading) return <div>Загрузка...</div>;
    if (!role) return <div>Роль не найдена</div>;

    return (
        <Show 
            resource={`events/${id}/roles`}
            id={role_id}
            title={`Информация про ${role.name}`}
        >
            <SimpleShowLayout>
                <TextField source="id" label="ID" />
                <TextField source="name" label="Название роли" />
                <FunctionField
                    label="Активности"
                    render={(record: any) => {
                        if (!record.activities_values || record.activities_values.length === 0) {
                            return <span>Нет активностей</span>;
                        }
                        return (
                            <div>
                                {record.activities_values.map((activity: any, index: number) => (
                                    <div key={index} style={{ marginBottom: '16px' }}>
                                        <div><strong>Активность:</strong> {activity.activity_id || 'не указан'}</div>
                                        {activity.act_vars && activity.act_vars.length > 0 ? (
                                            <pre>
                                                {JSON.stringify(activity.act_vars, null, 2)}
                                            </pre>
                                        ) : (
                                            <div style={{ marginTop: '8px' }}>Нет переменных</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        );
                    }}
                />
            </SimpleShowLayout>
        </Show>
    );
};