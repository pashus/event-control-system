from rest_framework import serializers
from django.contrib.auth import get_user_model
from djoser.serializers import UserDeleteSerializer

User = get_user_model()

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'access_level']


class AdminUserDeleteSerializer(UserDeleteSerializer):
    current_password = serializers.CharField(required=False)

    def validate_current_password(self, value):
        request = self.context.get('request')
        if request and request.user.is_staff:
            # Для админа проверка пароля не нужна
            return value
        # Для остальных вызываем стандартную проверку
        return super().validate_current_password(value)