from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser  # или своя проверка
from django.contrib.auth import get_user_model
from .serializers import UserListSerializer


User = get_user_model()


class UserListViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    # permission_classes = [IsAdminUser]