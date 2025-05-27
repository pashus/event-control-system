from datetime import datetime
import mysql.connector


class EventDB():
    def __init__(self):
        self.db = mysql.connector.connect(
            host="localhost",
            user="root",
            passwd="0000",
            database="testdatabase"
        )
        self.cur = self.db.cursor(dictionary=True)

    def close(self):
        self.db.commit()
        self.cur.close()
        self.db.close()

    def new_event(self, name, desc, start, end, loc, reg_form):
        self.cur.execute(
            """
            INSERT INTO events (name, description, start_time, end_time, location, registration_form)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (name, desc, start, end, loc, reg_form)
        )

        event_id = self.cur.lastrowid
        
        roles_table = f'roles_{event_id}'
        players_table = f'players_{event_id}'
        activities_table = f'activities_{event_id}'
        
        self.cur.execute(
            f"""
            CREATE TABLE {roles_table} (
                id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                name VARCHAR(50) NOT NULL
            )
            """
        )

        self.cur.execute(
            f"""
            CREATE TABLE {activities_table} (
                id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                name VARCHAR(50) NOT NULL
            )
            """
        )

        self.cur.execute(
            f"""
            CREATE TABLE {players_table} (
                id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
                first_name VARCHAR(50) NOT NULL,
                last_name VARCHAR(50) NOT NULL,
                group_name VARCHAR(50) NOT NULL,
                is_present BOOLEAN DEFAULT FALSE
            )
            """
        )

        self.cur.execute(
            f"""
            CREATE TABLE players_roles_{event_id} (
                player_id INTEGER NOT NULL,
                role_id INTEGER NOT NULL,
                PRIMARY KEY (player_id, role_id),
                FOREIGN KEY(player_id) REFERENCES {players_table}(id),
                FOREIGN KEY(role_id) REFERENCES {roles_table}(id)
            )
            """
        )

        self.db.commit()
        return event_id
    
    def new_player(self, event_id, first_name, last_name, group):
        query = f"INSERT INTO players_{event_id} (first_name, last_name, group_name)"
        query += " VALUES (%s, %s, %s)"
        self.cur.execute(
            query,
            (first_name, last_name, group)
        )
        self.db.commit()

    def get_events(self):
        self.cur.execute(
            "SELECT * FROM events"
        )
        result = self.cur.fetchall()
        return result
    
    def get_event(self, event_id):
        self.cur.execute(
            f"SELECT * FROM events WHERE id = {event_id}"
        )
        result = self.cur.fetchone()
        return result

    def get_players(self, event_id):
        self.cur.execute(
            f"SELECT * FROM players_{event_id}"
        )
        result = self.cur.fetchall()
        return result
    
    def get_player(self, event_id, player_id):
        self.cur.execute(
            f"SELECT * FROM players_{event_id} WHERE id = {player_id}"
        )
        result = self.cur.fetchone()
        return result

    def check_in(self, event_id, player_id):
        self.cur.execute(
            f"UPDATE players_{event_id} SET is_present = TRUE WHERE id = {player_id}"
        )
        # Сделать проверку на то, нашлась ли подходящая строка
        self.db.commit()

    def delete_event(self, event_id):
        self.cur.execute(f"DELETE FROM events WHERE id = {event_id}")
        self.cur.execute(f"DROP TABLE players_roles_{event_id}")
        self.cur.execute(f"DROP TABLE players_{event_id}")
        self.cur.execute(f"DROP TABLE roles_{event_id}")
        self.cur.execute(f"DROP TABLE activities_{event_id}")
        self.db.commit()

    def delete_player(self, event_id, player_id):
        self.cur.execute(f"DELETE FROM players_{event_id} WHERE id = {player_id}")
        self.db.commit()

