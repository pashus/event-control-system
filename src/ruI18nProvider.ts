import { I18nProvider } from "@refinedev/core";

export const ruI18nProvider: I18nProvider = {
  translate: (key: string, params?: object) => {
    const translations: Record<string, string> = {
      "buttons.save": "Сохранить",
      "buttons.cancel": "Отмена",
      "buttons.edit": "Редактировать",
      "buttons.create": "Создать",
      "buttons.delete": "Удалить",
      "buttons.submit": "Отправить",
      "buttons.logout": "Выйти",
      "buttons.refresh": "Обновить",
      "buttons.show": "Показать",
      "buttons.confirm": "Действительно удалить?",
      "events.titles.list": "Мероприятия",
      "users.titles.list": "Пользователи",
      "users.titles.create": "Добавить пользователя",
      "events.titles.edit": "Редактировать мероприятие",
      "users.titles.edit": "Редактировать пользователя",
    };

    return translations[key] || key;
  },
  changeLocale: (locale: string) => Promise.resolve(),
  getLocale: () => "ru",
};
