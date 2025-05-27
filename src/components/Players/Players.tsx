import {
    required,
    List,
    Datagrid,
    TextField,
    TextInput,
    BooleanField,
    Show,
    Create,
    SimpleForm,
    SimpleShowLayout,
    TopToolbar,
    CreateButton,
    EditButton,
    DeleteButton,
    useRefresh,
    useRedirect,
    useNotify,
    Edit,
    BooleanInput,
    useCreate,
    useGetList,
    Button,
    Link,
} from 'react-admin';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Действия для списка участников
const PlayerListActions = () => {
    const { id: eventId } = useParams();
    return (
        <TopToolbar>
            <CreateButton 
                label="Добавить участника"
                to={`/events/${eventId}/players/create`}
            />
        </TopToolbar>
    );
};


// export const PlayerList = () => {
//     const { id: eventId } = useParams();
//     const { data, isLoading } = useGetList('event_players', {
//         filter: { event_id: eventId }
//     });

//     if (isLoading) return <div>Загрузка...</div>;
//     if (!eventId) return <div>Мероприятие не найдено</div>;

//     return (
//         <List 
//             resource="event_players"
//             title="Участники мероприятия"
//             empty={
//                 <div>
//                     <p>Участники не найдены</p>
//                     <Button
//                         component={Link}
//                         to={`/events/${eventId}/players/create`}
//                         label="Добавить участника"
//                         sx={{ marginTop: 2 }}
//                     />
//                 </div>
//             }
//             actions={
//                 <TopToolbar>
//                     <CreateButton 
//                         label="Добавить участника"
//                         to={`/events/${eventId}/players/create`}
//                     />
//                 </TopToolbar>
//             }
//         >
//             <Datagrid>
//                 <TextField source="first_name" label="Имя" />
//                 <TextField source="last_name" label="Фамилия" />
//                 <TextField source="group_name" label="Группа" />
//                 <BooleanField source="is_present" label="Присутствовал" />
//                 <EditButton />
//                 <DeleteButton />
//             </Datagrid>
//         </List>
//     );
// };

export const PlayerList = () => {
    const { id: eventId } = useParams();
    const { data, isLoading } = useGetList('event_players', {
        filter: { event_id: eventId }
    });

    const [localPlayers, setLocalPlayers] = useState<any[]>([]);

    useEffect(() => {
        // Берём из localStorage участников для текущего eventId
        const saved = JSON.parse(localStorage.getItem('newPlayers') || '[]');
        // Фильтруем по event_id
        const filtered = saved.filter((p: any) => p.event_id === eventId);
        setLocalPlayers(filtered);
    }, [eventId]);

    if (isLoading) return <div>Загрузка...</div>;
    if (!eventId) return <div>Мероприятие не найдено</div>;


    const allPlayers = [...(data || []), ...localPlayers];

    return (
        <List
            resource="event_players"
            title="Участники мероприятия"
            actions={<PlayerListActions />}
            empty={
                <div>
                    <p>Участники не найдены</p>
                    <Button
                        component={Link}
                        to={`/events/${eventId}/players/create`}
                        label="Добавить участника"
                        sx={{ marginTop: 2 }}
                    />
                </div>
            }
            filter={{ event_id: eventId }}
        >
            <Datagrid data={allPlayers}>
                <TextField source="first_name" label="Имя" />
                <TextField source="last_name" label="Фамилия" />
                <TextField source="group_name" label="Группа" />
                <BooleanField source="is_present" label="Присутствовал" />
                <EditButton />
                <DeleteButton />
            </Datagrid>
        </List>
    );
};


export const PlayerCreate = () => {
    const { id: eventId } = useParams();
    const notify = useNotify();
    const redirect = useRedirect();
    const refresh = useRefresh();
    const [create] = useCreate();

    const handleSave = async (data: any) => {
    try {
        await create(
            'event_players',
            { data: { ...data, event_id: eventId } }
        );
        notify('Участник добавлен', { type: 'success' });

        
        redirect(`/events/${eventId}/players`);
    } catch (error) {
        notify('Ошибка при добавлении', { type: 'error' });
    }
};
    return (
        <Create resource="event_players" title="Добавить участника">
            <SimpleForm onSubmit={handleSave}>
                <TextInput source="first_name" label="Имя" validate={required()} />
                <TextInput source="last_name" label="Фамилия" validate={required()} />
                <TextInput source="group_name" label="Группа" validate={required()} />
            </SimpleForm>
        </Create>
    );
};


export const PlayerShow = () => {
    return (
        <Show>
            <SimpleShowLayout>
                <TextField source="first_name" label="Имя" />
                <TextField source="last_name" label="Фамилия" />
                <TextField source="group_name" label="Группа" />
                <BooleanField source="is_present" label="Присутствовал" />
            </SimpleShowLayout>
        </Show>
    );
};



export const PlayerEdit = () => {
    const { playerId } = useParams();
    return (
        <Edit 
            title={`Редактирование участника`}
            resource="event_players"
            id={playerId} 
        >
            <SimpleForm>
                <TextInput source="first_name" label="Имя" validate={required()} />
                <TextInput source="last_name" label="Фамилия" validate={required()} />
                <TextInput source="group_name" label="Группа" validate={required()} />
                <BooleanInput source="is_present" label="Присутствовал" />
            </SimpleForm>
        </Edit>
    );
};