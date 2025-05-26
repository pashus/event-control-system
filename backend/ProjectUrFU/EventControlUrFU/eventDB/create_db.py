import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    passwd="12345",
    database="testdatabase"
)

cur = db.cursor()

# cur.execute("CREATE DATABASE testdatabase")

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


