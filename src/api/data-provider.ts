import fakeDataProvider from 'ra-data-fakerest';

export const baseFormUrl = 'https://forms.yandex.ru/u/68021be3068ff098e0031717/'

const data = {
    events: [
        {
            id: 1,
            name: 'Столовая НВК',
            date: '2025-05-20',
            location: 'Екатеринбург',
            startTime: '10:00',
            entryType: ['nfc', 'qr'],
        },
        {
            id: 2,
            name: 'Хакатон AI',
            date: '2025-06-15',
            location: 'Екатеринбург',
            startTime: '12:00',
            entryType: ['qr'],
        },
        {
            id: 3,
            name: 'Безимени',
            date: '2025-02-12',
            location: 'Екатеринбург',
            startTime: '16:00',
            entryType: ['qr'],
        },
    ],

    users: [
        {
            id: 1,
            fullName: 'Мартынов Павел Максимович',
            studyGroup: 'РИ-230948',
            email: '25pashok@mail.ru',
            roles: [
                { eventId: 1, roles: ['участник', 'куратор'] },
                { eventId: 2, roles: ['организатор'] },
            ]
        },
        {
            id: 2,
            fullName: 'Иваныч',
            studyGroup: 'РИ-45124',
            email: '123',
            roles: [
                { eventId: 3, roles: ['участник'] },
                { eventId: 1, roles: ['участник'] }
            ]
        }
    ]
};

export const dataProvider = fakeDataProvider(data);
