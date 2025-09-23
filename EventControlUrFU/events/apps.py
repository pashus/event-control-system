from django.apps import AppConfig
import events.eventDB.create_db as createDB

class EventsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'events'

    def ready(self):
        createDB.create()