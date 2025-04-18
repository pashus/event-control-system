import fakeDataProvider from 'ra-data-fakerest';

const data = {
    events: [
        {
            id: 1,
            name: 'Столовая НВК',
            date: '2025-05-20',
            location: 'Екатеринбург',
            startTime: '10:00',
            entryType: 'nfc',
            registrationLink: 'https://forms.yandex.ru/u/68021be3068ff098e0031717/'
        },
        {
            id: 2,
            name: 'Хакатон AI',
            date: '2025-06-15',
            location: 'Екатеринбург',
            startTime: '12:00',
            entryType: 'qr',
            registrationLink: 'https://forms.yandex.ru/u/ai_hackathon/'
        },
    ],

    users: [
        {
            id: 1,
            fullName: 'Мартынов Павел Максимович',
            studyGroup: 'РИ-230948',
            email: '25pashok@mail.ru',
        }
    ]
};

export const dataProvider = fakeDataProvider(data);
