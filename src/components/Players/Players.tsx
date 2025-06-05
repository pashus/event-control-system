    import {
    List,
    Datagrid,
    TextField,
    BooleanField,
    useNotify,
    useRefresh,
    SimpleForm,
    TextInput,
    Show,
    SimpleShowLayout,
    useDataProvider,
    useGetOne,
    Loading,
    } from "react-admin";
    import { useParams, useNavigate } from "react-router";
    import { useState } from "react";
    import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    Button,
    FormControl,
    Toolbar,
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions
} from "@mui/material";


    interface PlayerCreateFormProps {
    eventId: string;
    playerId?: string
    onCancel: () => void;
    }

    const AddPlayerButton = ({ eventId }: { eventId: string }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
        <Button variant="contained" onClick={() => setOpen(true)}>
            Добавить участника
        </Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Добавить участника</DialogTitle>
            <DialogContent>
            <PlayerCreateForm
                eventId={eventId}
                onCancel={() => setOpen(false)}
            />
            </DialogContent>
        </Dialog>
        </>
    );
    };

    const PlayerCreateForm = ({ eventId, onCancel }: PlayerCreateFormProps) => {
    const notify = useNotify();
    const refresh = useRefresh();
    const dataProvider = useDataProvider();

    const handleSubmit = async (data: any) => {
        await dataProvider.create(`events/${eventId}/players`, {
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                group_name: data.group_name,
            },
        });

        notify("Участник успешно добавлен");
        refresh();
        onCancel();
};

    return (
        <SimpleForm onSubmit={handleSubmit} toolbar={false}>
        <TextInput source="first_name" label="Имя" />
        <TextInput source="last_name" label="Фамилия" />
        <TextInput source="group_name" label="Группа" />
        <Button type="submit" variant="contained" color="primary">
            Сохранить
        </Button>
        <Button onClick={onCancel} sx={{ ml: 2 }}>
            Отмена
        </Button>
        </SimpleForm>
    );
};

    const PlayersActions = ({ eventId }: { eventId: string }) => {
    const navigate = useNavigate();
    return (
        <Toolbar>
        <Button onClick={() => navigate(-1)}>Назад</Button>
        <AddPlayerButton eventId={eventId} />
        </Toolbar>
    );
    };



    export function EventPlayersList() {
    const { id } = useParams();

    const { data: event } = useGetOne('events', { id: id ?? '' });

    if (!id) return null;

    return (
        <List
        resource={`events/${id}/players`}
        title={`Участники мероприятия: ${event?.name ?? ''}`}
        actions={<PlayersActions eventId={id} />}
        >
        <Datagrid
                rowClick={(_, __, record) => `/events/${id}/players/${record.id}/show`}
            >
            <TextField source="id" label="ID" />
            <TextField source="first_name" label="Имя" />
            <TextField source="last_name" label="Фамилия" />
            <TextField source="group_name" label="Группа" />
            <BooleanField source="checked_in" label="Отметился" />
        </Datagrid>
        </List>
    );
    }

    export function PlayerShow() {
    const { id, player_id } = useParams<{ id: string; player_id: string }>();
    const notify = useNotify();
    const refresh = useRefresh();
    const navigate = useNavigate()
    const dataProvider = useDataProvider();
    const [presence, setPresence] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const {
        data: player,
        isLoading,
    } = useGetOne(
        `events/${id}/players`,
        { id: player_id || "" },
        { enabled: !!id && !!player_id }
    );

    const handleSubmit = async () => {
        if (!id || !player_id || presence !== "present") return;
        setLoading(true);
        try {
            await dataProvider.create(`events/${id}/players/${player_id}/check-in`, {
                data: {},
            });
            notify("Участник отмечен");
            refresh();
        } catch (error) {
            notify("Ошибка при отметке", { type: "error" });
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return <Loading />;

    return (
        <Show
            resource={`events/${id}/players`}
            id={player_id}
            title="Информация об участнике"
        >
            <Button
                onClick={() => navigate(-1)}
                sx={{ mb: 2 }}
            >
                Назад
            </Button>
            <SimpleShowLayout record={player}>
                <TextField source="first_name" label="Имя" />
                <TextField source="last_name" label="Фамилия" />
                <TextField source="group_name" label="Группа" />
                <BooleanField source="is_present" label="Отметился" />

                {!player?.is_present && (
                    <>
                        <FormControl component="fieldset" sx={{ mt: 2 }}>
                            <FormLabel component="legend">Присутствие</FormLabel>
                            <RadioGroup
                                row
                                value={presence}
                                onChange={(e) => setPresence(e.target.value)}
                            >
                                <FormControlLabel
                                    value="present"
                                    control={<Radio />}
                                    label="Присутствует"
                                />
                                <FormControlLabel
                                    value="absent"
                                    control={<Radio />}
                                    label="Отсутствует"
                                />
                            </RadioGroup>
                        </FormControl>
                        <Toolbar>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={presence === "" || loading}
                                onClick={handleSubmit}
                            >
                                Сохранить
                            </Button>
                        </Toolbar>
                    </>
                )}
            </SimpleShowLayout>
        </Show>
    );
}