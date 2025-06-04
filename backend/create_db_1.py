import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root", # Имя пользователся в MySQL. Чаще всего он просто root.
    passwd="0000", # Сюда вставить свой пароль от подключения к MySQL (как когда включаешь mysql воркбенч).
)

cur = db.cursor()

cur.execute("CREATE DATABASE testdatabase")

db.close()
