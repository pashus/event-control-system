import json
import events.eventDB.eventDB as eventDB
from datetime import datetime

def new_event(JSON):
    data = json.loads(JSON)
    db = eventDB.EventDB()

    event_info = data["event_info"]
    event_id = db.new_event(
        name=event_info["name"],
        desc=event_info["description"],
        start=datetime.fromisoformat(event_info["start_time"]),
        end=datetime.fromisoformat(event_info["end_time"]),
        loc=event_info["location"],
        reg_form=json.dumps(data)
    )

    settings = data["settings"]
    # has player balance
    for act in settings["activities"]:
        db.new_activity(
            event_id=event_id,
            name=act["name"],
            act_vars=json.dumps(act["act_vars"])
        )

    for role in settings["roles"]:
        db.new_role(
            event_id=event_id,
            name=role["name"],
            act_data=json.dumps(role["activities_values"])
        )

    all_roles = db.get_roles(event_id=event_id)
    print(all_roles)

    db.close()
    return event_id