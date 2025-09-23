from django.urls import path
from .views import *

urlpatterns = [
    path('events/', EventsView.as_view(), name='event-list'),
    path('events/<int:pk>/', EventView.as_view(), name='event-detail'),
    path('events/<int:pk>/players/', PlayersView.as_view(), name='player-list'),
    path('events/<int:event_id>/players/<int:player_id>/', PlayerView.as_view(), name='player-detail'),
    path('events/<int:event_id>/players/<int:player_id>/check-in/', CheckInView.as_view(), name='check-in'),

    path('events/new/', EventsJSONView.as_view(), name='new-event'),
    path('events/<int:pk>/activities/', ActivitiesView.as_view(), name='activity-list'),
    path('events/<int:event_id>/activities/<int:act_id>/', ActivityView.as_view(), name='activity-detail'),
    path('events/<int:pk>/roles/', RolesView.as_view(), name='role-list'),
    path('events/<int:event_id>/roles/<int:role_id>/', RoleView.as_view(), name='role-detail'),
    path('events/<int:event_id>/players/<int:player_id>/vars/', AllPlyaerVarsView.as_view(), name='all-vars'),
    path('events/<int:event_id>/players/<int:player_id>/vars/<int:act_id>/', PlayerVarsView.as_view(), name='act-vars'),

    path('events/<int:event_id>/players/<int:player_id>/qr-code/', generate_qr_code, name='check-in-qr'),

    path('events/<int:pk>/registration/', EventRegistrationView.as_view(), name='registration'),

    # он вообще не должен тут быть
    path('user-role/<user_id>/', UserAccessView.as_view(), name='user-access'),
]
