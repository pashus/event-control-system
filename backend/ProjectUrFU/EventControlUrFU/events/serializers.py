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