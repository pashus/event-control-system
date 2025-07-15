from rest_framework import serializers
from django.contrib.auth import get_user_model


User = get_user_model()


class EventSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=50)
    description = serializers.CharField()
    start_time = serializers.DateTimeField()
    end_time = serializers.DateTimeField()
    location = serializers.CharField()
    # registration_form = serializers.JSONField()


class PlayerSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)
    group_name = serializers.CharField(max_length=50)
    is_present = serializers.BooleanField(required=False)
    role_id = serializers.IntegerField(required=False)

class ActivitySerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=50)
    act_vars = serializers.JSONField()

class RoleSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=50)
    activities_values = serializers.JSONField(required=False)

class PlayerVarsSerializer(serializers.Serializer):
    player_id = serializers.IntegerField(required=False)
    activity_id = serializers.IntegerField(required=False)
    act_vars = serializers.JSONField()

# вообще не нужный и тупой костыль
class RoleIDSErializer(serializers.Serializer):
    role_id = serializers.IntegerField()

class AccessLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["access_level",]