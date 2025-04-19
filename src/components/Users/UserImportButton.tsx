import React, { useState } from 'react';
import {
    Button as RaButton,
    useDataProvider,
    useNotify,
    useRefresh,
} from 'react-admin';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
} from '@mui/material';
import UploadIcon from '@mui/icons-material/UploadFile';

function UserImportButton() {
    const [open, setOpen] = useState(false);
    const [fileError, setFileError] = useState<string | null>(null);
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            setFileError('Пожалуйста, выберите JSON‑файл');
            return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const text = reader.result as string;
                const records = JSON.parse(text);
                if (!Array.isArray(records)) {
                    throw new Error('JSON не массив');
                }
                await Promise.all(
                    records.map(record =>
                        dataProvider.create('users', { data: record })
                    )
                );
                notify('Пользователи успешно импортированы', { type: 'info' });
                refresh();
                setOpen(false);
            } catch (err) {
                console.error(err);
                setFileError('Невалидный JSON‑файл или неверный формат данных');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    return (
        <>
            <RaButton
                label="Импорт из JSON"
                onClick={() => setOpen(true)}
                startIcon={<UploadIcon />}
            />
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Импорт пользователей из JSON</DialogTitle>
                <DialogContent>
                    <Box textAlign="center" py={2}>
                        <Button
                            variant="outlined"
                            component="label"
                        >
                            Выбрать файл…
                            <input
                                type="file"
                                accept=".json,application/json"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>
                    </Box>
                    {fileError && (
                        <Typography color="error" variant="body2" textAlign="center">
                            {fileError}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Отмена</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default UserImportButton;
