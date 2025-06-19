import { useState } from 'react';
import { useParams } from "react-router-dom";
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
    SimpleShowLayout,
    Show,
} from 'react-admin';
import { Dialog, DialogTitle, DialogContent, Box } from '@mui/material';


export function EventActivitiesList() {
    const { id } = useParams();
    const { data: event} = useGetOne("events", { id });

    if (!id) return null;

    return (
        <List
            resource={`events/${id}/activities`}
            title={`Активности мероприятия: ${event?.name}`}
            actions={<ActivitiesListActions eventId={id} />}
        >
            <Datagrid size="medium" rowClick="show">
                <TextField source="id" label="ID" />
                <TextField source="name" label="Название" />
                <FunctionField
                    label="Переменные"
                    render={(record: any) => (
                        <pre style={{ margin: 0, fontSize: '0.9rem' }}>
                            {record.act_vars}
                        </pre>
                    )}
                />
            </Datagrid>
        </List>
    );
}


const ActivitiesListActions = ({ eventId }: { eventId: string }) => {
    return (
        <TopToolbar>
            <AddActivityButton eventId={eventId} />
        </TopToolbar>
    );
};

const AddActivityButton = ({ eventId }: { eventId: string }) => {
    const [open, setOpen] = useState(false);
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const handleSubmit = async (data: any) => {
        try {
            await dataProvider.create(`events/${eventId}/activities`, {
                data: {
                    name: data.name,
                    act_vars: data.act_vars
                },
            });

            notify("Активность успешно добавлена", { type: "success" });
            refresh();
            setOpen(false);
        } catch (error) {
            notify("Ошибка при добавлении активности", { type: "error" });
        }
    };

    return (
        <>
            <Button onClick={() => setOpen(true)}>Добавить активность</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Добавить активность</DialogTitle>
                <DialogContent>
                    <SimpleForm onSubmit={handleSubmit} toolbar={false} sx={{ p: 0 }}>
                        <TextInput 
                            source="name" 
                            label="Название активности" 
                            validate={required()}
                        />
                        <TextInput 
                            source="act_vars" 
                            label="Переменные активности"
                        />
                            <Box display="flex" width="100%" justifyContent="space-between">
                                <Button onClick={() => setOpen(false)} type="submit">
                                    Сохранить
                                </Button>
                                <Button onClick={() => setOpen(false)}>Отмена</Button>
                            </Box>
                    </SimpleForm>
                </DialogContent>
            </Dialog>
        </>
    );
};

export const ActivityShow = () => {
    const { id, activity_id } = useParams();
    const {
        data: activity,
        isLoading,
    } = useGetOne(`events/${id}/activities`, { id: activity_id });

    if (isLoading) return <div>Загрузка...</div>;

    return (
        <Show 
            resource={`events/${id}/activities`}
            id={activity_id}
            title={`Информация про ${activity.name}`}
        >
            <SimpleShowLayout>
                <TextField source="id" label="ID" />
                <TextField source="name" label="Название активности" />
                <FunctionField
                    label="Переменные"
                    render={(record: any) => (
                        <Box sx={{ 
                        }}>
                            <pre style={{ margin: 0 }}>
                                {record.act_vars}
                            </pre>
                        </Box>
                    )}
                />
            
            </SimpleShowLayout>
        </Show>
    );
};
