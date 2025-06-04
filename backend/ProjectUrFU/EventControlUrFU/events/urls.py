from django.urls import path
from .views import EventsView, EventView, PlayersView, PlayerView, CheckInView

urlpatterns = [
    path('events/', EventsView.as_view(), name='event-list'),
    path('events/<int:pk>/', EventView.as_view(), name='event-detail'),
    path('events/<int:pk>/players/', PlayersView.as_view(), name='player-list'),
    path('events/<int:event_id>/players/<int:player_id>/', PlayerView.as_view(), name='player-detail'),
    path('events/<int:event_id>/players/<int:player_id>/check-in/', CheckInView.as_view(), name='check-in')
]
