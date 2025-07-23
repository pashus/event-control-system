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

      "notifications.success": "Успешно",
      "notifications.deleteSuccess": "Удалено",
      "notifications.deleteError": "Ошибка при удалении",

      "users.titles.list": "Пользователи",
      "users.titles.create": "Добавить пользователя",
      "users.titles.edit": "Редактировать пользователя",

      "events.titles.list": "Мероприятия",
      "events.titles.create": "Создать мероприятие",
      "events.titles.edit": "Редактировать мероприятие",

      "players.titles.list": "Участники",
      "players.players": "Участники",
      "players.titles.create": "Добавить участника",
      "players.titles.edit": "Редактировать участника",

      "activities.titles.list": "Активности",
      "activities.activities": "Активности",
      "activities.titles.create": "Создать активность",
      "activities.titles.edit": "Редактировать активность",

      "roles.roles": "Роли",
      "roles.titles.list": "Роли",
      "roles.titles.create": "Создать роль",
      "roles.titles.edit": "Редактировать роль",
    };

    return translations[key] || key;
  },
  changeLocale: (locale: string) => Promise.resolve(),
  getLocale: () => "ru",
};
