from datetime import datetime
import mysql.connector, json
from events.eventDB.settings_consts import *


class EventDB():
    def __init__(self):
        self.db = mysql.connector.connect(
            host=HOST,
            user=USER,
            passwd=PASSWD,
            database=DB_NAME
        )
        self.cur = self.db.cursor(dictionary=True)

    def close(self):
        self.db.commit()
        self.cur.close()
        self.db.close()

    # Новый ивент
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
                name VARCHAR(50) NOT NULL,
                act_vars JSON NOT NULL
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
                is_present BOOLEAN DEFAULT FALSE,
                role_id INTEGER,
                FOREIGN KEY (role_id) REFERENCES {roles_table}(id) ON DELETE SET NULL
            )
            """
        )

        # self.cur.execute(
        #     f"""
        #     CREATE TABLE players_roles_{event_id} (
        #         player_id INTEGER NOT NULL,
        #         role_id INTEGER NOT NULL,
        #         PRIMARY KEY (player_id, role_id),
        #         FOREIGN KEY(player_id) REFERENCES {players_table}(id),
        #         FOREIGN KEY(role_id) REFERENCES {roles_table}(id)
        #     )
        #     """
        # )

        self.cur.execute(
            f"""
            CREATE TABLE activities_roles_{event_id} (
                activity_id INTEGER NOT NULL,
                role_id INTEGER NOT NULL,
                act_vars JSON NOT NULL,
                PRIMARY KEY (activity_id, role_id),
                FOREIGN KEY(activity_id) REFERENCES {activities_table}(id) ON DELETE CASCADE,
                FOREIGN KEY(role_id) REFERENCES {roles_table}(id) ON DELETE CASCADE
            )
            """
        )

        self.cur.execute(
            f"""
            CREATE TABLE players_activities_{event_id} (
                player_id INTEGER NOT NULL,
                activity_id INTEGER NOT NULL,
                act_vars JSON NOT NULL,
                PRIMARY KEY (player_id, activity_id),
                FOREIGN KEY(player_id) REFERENCES {players_table}(id) ON DELETE CASCADE,
                FOREIGN KEY(activity_id) REFERENCES {activities_table}(id) ON DELETE CASCADE
            )
            """
        )

        self.db.commit()
        return event_id
    
    # Новая активность
    def new_activity(self, event_id, name, act_vars):
        query = f"INSERT INTO activities_{event_id} (name, act_vars)"
        query += " VALUES (%s, %s)"
        self.cur.execute(
            query,
            (name, act_vars)
        )
        act_id = self.cur.lastrowid
        self.db.commit()
        return act_id

    # получить список активностей
    def get_activities(self, event_id):
        self.cur.execute(
            f"SELECT * FROM activities_{event_id}"
        )
        result = self.cur.fetchall()
        return result
    
    # получить активность
    def get_activity(self, event_id, act_id):
        self.cur.execute(
            f"SELECT * FROM activities_{event_id}" + " WHERE id = %s",
            (act_id,)
        )
        result = self.cur.fetchone()
        return result

    # удалить активность
    def delete_activity(self, event_id, act_id):
        self.cur.execute(
            f"DELETE FROM activities_{event_id}" + " WHERE id = %s",
            (act_id,)
        )
        self.db.commit()

    # изменить активность
    def change_activity(self, event_id, act_id, act_info):
        act_name = act_info.get("name")
        if act_name is not None:
            query = f"UPDATE activities_{event_id} SET name"
            query += " = %s WHERE id = %s"
            self.cur.execute(
                query,
                (act_name, act_id)
            )

        act_vars = act_info.get("act_vars")
        if act_vars is not None:
            act_vars = json.dumps(act_vars)
            query = f"UPDATE activities_{event_id} SET act_vars"
            query += " = %s WHERE id = %s"
            self.cur.execute(
                query,
                (act_vars, act_id)
            )

        self.db.commit()

    # сбросить переменные у участинка 
    def reset_act_vars(self, event_id, act_id, player_id):
        activity = self.get_activity(event_id=event_id, act_id=act_id)
        if activity is None:
            return
        act_vars_types = activity['act_vars']
        act_vars = []
        for var_type in json.loads(act_vars_types):
            act_vars.append((var_type[0], False if var_type[1] == 'bool' else 0,))

        query = f"INSERT INTO players_activities_{event_id} (player_id, activity_id, act_vars)"
        query += " VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE act_vars = VALUES(act_vars)"
        self.cur.execute(
            query,
            (player_id, act_id, act_vars)
        )
        self.db.commit()
        return act_vars

    # получить значения смежной таблицы
    # и поместить их в другую смежную таблицу
    # плеер_id акт_id переменные
    # роль_id акт переменные
    # получаем список переменных по роли и присваиваем плееру

    # получить все начальные значения переменных для роли
    def get_role_act_vars(self, event_id, role_id):
        self.cur.execute(
            f"SELECT * FROM activities_roles_{event_id}" + " WHERE role_id = %s",
            (role_id,)
        )
        result = self.cur.fetchall()
        return result
    
    # SELECT * FROM activities_roles_{event_id}
    # JOIN activities_{event_id}
    # ON activities_roles_{event_id}.activity_id = activities_{event_id}.id
    # WHERE role_id = {role_id} 

    # назначить переменные участнику по роли
    def set_role_vars(self, event_id, player_id, role_id=None):
        if role_id is None:
            role_id = self.get_player(event_id=event_id, player_id=player_id)['role_id']
        if role_id is None:
            return
        vars = self.get_role_act_vars(event_id=event_id, role_id=role_id)
        for act in vars:
            query = f"INSERT INTO players_activities_{event_id} (player_id, activity_id, act_vars)"
            query += " VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE act_vars = VALUES(act_vars)"
            self.cur.execute(
                query,
                (player_id, act['activity_id'], act['act_vars'])
            )

    # Новая роль
    def new_role(self, event_id, name, act_data):
        """
        act_data : [
            {
                name : name (храниться вместо этого будет id),
                act_vars : [(name, value), (name, value)]
            },
        ]
        поступает в виде string (JSON)
        """
        query = f"INSERT INTO roles_{event_id} (name)"
        query += " VALUES (%s)"
        self.cur.execute(
            query,
            (name,)
        )
        role_id = self.cur.lastrowid
        self.db.commit()

        query = f"INSERT INTO activities_roles_{event_id} (activity_id, role_id, act_vars)"
        query += " VALUES (%s, %s, %s)"
        act_data = json.loads(act_data)
        for act in act_data:
            act_id = act.get('activity_id')
            if act_id is None:
                self.cur.execute(
                    f"SELECT id FROM activities_{event_id}" + " WHERE name = %s",
                    (act.get('name'),)
                )
                act_id = self.cur.fetchone()['id']
            self.cur.execute(
                query,
                (act_id, role_id, json.dumps(act['act_vars']))    
            )
            # можно(нужно) заменить на то, что сначала создаётся список значений и передаётся в executemany
            # и для редактирования ролей в эту таблицу стоило бы добавлять через ON DUPLICATE KEY
            self.db.commit()
        return role_id

    # получить роли
    def get_roles(self, event_id):
        self.cur.execute(
            f"SELECT * FROM roles_{event_id}"
        )
        result = self.cur.fetchall()
        return result
    
    # получить роль
    def get_role(self, event_id, role_id):
        self.cur.execute(
            f"SELECT * FROM roles_{event_id}" + " WHERE id = %s",
            (role_id,)
        )
        result = self.cur.fetchone()
        return result

    # назначить роль
    def assign_role(self, event_id, player_id, role_id):
        query = f"UPDATE players_{event_id}"
        query += " SET role_id = %s WHERE id = %s"
        self.cur.execute(
            query,
            (role_id, player_id)
        )
        self.db.commit()
        self.set_role_vars(event_id=event_id, player_id=player_id, role_id=role_id)

    # забрать у участинка роль
    def take_back_role(self, event_id, player_id):
        query = f"UPDATE players_{event_id}"
        query += " SET role_id = NULL WHERE id = %s"
        self.cur.execute(
            query,
            (player_id,)
        )
        self.db.commit()

    # удалить роль
    def delete_role(self, event_id, role_id):
        self.cur.execute(f"DELETE FROM activities_roles_{event_id}" + " WHERE role_id = %s", (role_id,))
        self.cur.execute(f"DELETE FROM roles_{event_id}" + " WHERE id = %s", (role_id,))
        self.db.commit()

    # изменение роли
    def change_role(self, event_id, role_id, role_info):
        role_name = role_info.get('name')
        if role_info is not None:
            query = f"UPDATE roles_{event_id} SET name"
            query += " = %s WHERE id = %s"
            self.cur.execute(
                query,
                (role_name, role_id)
            )
        role_vars = role_info.get("activities_values")
        if role_vars is not None:
            # role_vars = json.loads(role_vars)
            for act in role_vars:
                act_id = act.get('activity_id')
                if act_id is None:
                    continue
                query = f"INSERT INTO activities_roles_{event_id} (activity_id, role_id, act_vars)"
                query += " VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE act_vars = VALUES(act_vars)"
                self.cur.execute(
                    query,
                    (act_id, role_id, json.dumps(act.get('act_vars')),)
                )
        self.db.commit()

    # получить переменные участника 
    def get_all_player_vars(self, event_id, player_id):
        self.cur.execute(
            f"SELECT * FROM players_activities_{event_id}" + " WHERE player_id = %s",
            (player_id,)
        )
        result = self.cur.fetchall()
        return result
    
    # получить переменные участника по конкртетной активности 
    def get_player_vars(self, event_id, player_id, act_id):
        self.cur.execute(
            f"SELECT * FROM players_activities_{event_id}" + " WHERE player_id = %s and activity_id = %s",
            (player_id, act_id,)
        )
        result = self.cur.fetchone()

        return result
    
    # назначить переменные участнику 
    def set_player_vars(self, event_id, player_id, act_id, act_vars):
        query = f"INSERT INTO players_activities_{event_id} (player_id, activity_id, act_vars)"
        query += " VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE act_vars = VALUES(act_vars)"
        self.cur.execute(
            query,
            (player_id, act_id, act_vars)
        )
        self.db.commit()

    # Новый участник
    def new_player(self, event_id, first_name, last_name, group, role_id=None):
        if role_id is None:
            query = f"INSERT INTO players_{event_id} (first_name, last_name, group_name)"
            query += " VALUES (%s, %s, %s)"
            self.cur.execute(
                query,
                (first_name, last_name, group)
            )
            player_id = self.cur.lastrowid
        else:
            query = f"INSERT INTO players_{event_id} (first_name, last_name, group_name, role_id)"
            query += " VALUES (%s, %s, %s, %s)"
            self.cur.execute(
                query,
                (first_name, last_name, group, role_id)
            )
            player_id = self.cur.lastrowid
            self.set_role_vars(event_id=event_id, player_id=player_id, role_id=role_id)
        self.db.commit()
        return player_id

    # получить участников
    def get_players(self, event_id):
        self.cur.execute(
            f"SELECT * FROM players_{event_id}"
        )
        result = self.cur.fetchall()
        return result
    
    # получить участника
    def get_player(self, event_id, player_id):
        self.cur.execute(
            f"SELECT * FROM players_{event_id}" + " WHERE id = %s",
            (player_id,)
        )
        result = self.cur.fetchone()
        return result
    
    # удалить участинка
    def delete_player(self, event_id, player_id):
        self.cur.execute(f"DELETE FROM players_{event_id}" + " WHERE id = %s", (player_id,))
        self.db.commit()

    # Изменить участника
    def change_player(self, event_id, player_id, player_info):
        for key, value in player_info.items():
            query = f"UPDATE players_{event_id}"
            query += f" SET {key}" + " = %s WHERE id = %s"
            self.cur.execute(
                query,
                (value, player_id)
            )
        self.db.commit()
        role_id = player_info.get('role_id')
        if role_id is not None:
            self.set_role_vars(event_id=event_id, player_id=player_id, role_id=role_id)

    # отметиться
    def check_in(self, event_id, player_id):
        self.cur.execute(
            f"UPDATE players_{event_id} SET is_present = TRUE" + " WHERE id = %s",
            (player_id,)
        )
        # Сделать проверку на то, нашлась ли подходящая строка
        self.db.commit()

    # получить список ивентов
    def get_events(self):
        self.cur.execute(
            "SELECT * FROM events"
        )
        result = self.cur.fetchall()
        return result
    
    # получить ивент
    def get_event(self, event_id):
        self.cur.execute(
            "SELECT * FROM events WHERE id = %s",
            (event_id,)
        )
        result = self.cur.fetchone()
        return result

    # удалить ивент
    def delete_event(self, event_id):
        self.cur.execute("DELETE FROM events WHERE id = %s", (event_id,))
        self.cur.execute(f"DROP TABLE players_roles_{event_id}")
        self.cur.execute(f"DROP TABLE players_{event_id}")
        self.cur.execute(f"DROP TABLE roles_{event_id}")
        self.cur.execute(f"DROP TABLE activities_{event_id}")
        self.db.commit()

    # изменить ивент
    def change_event(self, event_id, event_info):
        for key, value in event_info.items():
            query = f"UPDATE events SET {key}"
            query += " = %s WHERE id = %s"
            self.cur.execute(
                query,
                (value, event_id)
            )
        self.db.commit()
