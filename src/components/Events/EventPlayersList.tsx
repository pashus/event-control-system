// EventPlayersList.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Button,
} from '@mui/material';
import { getEventPlayers } from '../../api/data-provider'; 

export default function EventPlayersList() {
    const { eventId } = useParams<{ eventId: string }>();
    const [players, setPlayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!eventId) return;
        getEventPlayers(eventId)
            .then(setPlayers)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [eventId]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Card sx={{ mt: 4 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>Участники мероприятия</Typography>
                {players.length === 0 && <Typography>Нет участников</Typography>}
                {players.map(player => (
                    <Typography key={player.id}>
                        {player.first_name} {player.last_name} — {player.group_name}
                    </Typography>
                ))}
                <Button variant="contained" sx={{ mt: 2 }} href={`/event_players/create?event_id=${eventId}`}>
                    Добавить участника
                </Button>
            </CardContent>
        </Card>
    );
}
