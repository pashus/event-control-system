import mysql.connector
from events.eventDB.settings_consts import *


def create():
    db = mysql.connector.connect(
    host=HOST,
    user=USER,
    passwd=PASSWD
    )

    cur = db.cursor()
    
    cur.execute(f"CREATE DATABASE IF NOT EXISTS {DB_NAME}")
    
    db.close()

    
    db = mysql.connector.connect(
    host=HOST,
    user=USER,
    passwd=PASSWD,
    database=DB_NAME
    )
    
    cur = db.cursor()

    cur.execute(
    """
    CREATE TABLE IF NOT EXISTS events (
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

create()