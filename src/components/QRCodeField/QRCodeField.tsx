import { useRecordContext, FieldProps } from 'react-admin';
import { QRCodeSVG } from 'qrcode.react';


export function QRCodeField({ source }: FieldProps) {
    const record = useRecordContext<any>();
    if (!record) return null;

    const qrValue = String(record[source]);

    return (
        <div>
            <QRCodeSVG value={qrValue} size={64} />
        </div>
    );
}

//ТЕСТОВЫЙ ВАРИАНТ. в дальнешем qrValue будет получаться через 
//апи, примерно как
//const qrValue = `https://event-system.com/checkin?event=${record.eventId}&user=${record.id}`;
//юзеру скорее всего придется задавать id_мероприятия, на которое
//он зареган