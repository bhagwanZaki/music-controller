# it will convert the models  into json format

from rest_framework import serializers
from .models import *

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('__all__')

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('guest_can_pause','votes_to_skip')

class UpdateRoomSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])
    class Meta:
        model = Room
        fields = ('guest_can_pause','votes_to_skip', 'code')
