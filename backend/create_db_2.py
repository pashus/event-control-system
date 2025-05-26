import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root", # Имя пользователся в MySQL. Чаще всего он просто root.
    passwd="0000", # Сюда вставить свой пароль от подключения к MySQL (как когда включаешь mysql воркбенч).
    database="testdatabase"
)

cur = db.cursor()

cur.execute(
"""
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    start_time DATETIME,
    end_time DATETIME,
    location TEXT,
    registration_form JSON NOT NULL
)
"""
)

db.close()
