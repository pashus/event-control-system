# Контроль мероприятий УРФУ
#Frontend
## Установка

Установите зависимости приложения командой:

```sh
npm install
```

## Режим разработки

Запустите приложение в режиме разработки командой:

```sh
npm run dev
```

## Режим продакшн

Соберите приложение для продакшна командой:

```sh
npm run build
```
#Backend
Как запустить:

1. Распаковать архив
2. На компьютере должен быть установлен MySQL
3. Запустить create_db 1 и 2, предварительно указав в них свой логин и пароль от подключения к MySQL 
4. В файле EventControlUrFU\eventDB\eventDB.py тоже прописать логин пароль
5. В командной строке перейти в папку с ProjectUrFU
6. Прописать в cmd следующие команды:
    python -m venv venv
    .\venv\Scripts\activate.bat
    python.exe -m pip install --upgrade pip
    pip install -r requirements.txt
7. Перейти в папку проекта в командной строке
    cd EventControlUrFU
8. Запустить бэк
    python manage.py runserver

