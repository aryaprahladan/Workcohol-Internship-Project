from rest_framework import serializers
from .models import Pitch, Investment
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class PitchSerializer(serializers.ModelSerializer):
    founder = UserSerializer(read_only=True)
    class Meta:
        model = Pitch
        fields = '__all__'

class InvestmentSerializer(serializers.ModelSerializer):
    #investor = UserSerializer(read_only=True)
    investor_username = serializers.CharField(source='investor.username', read_only=True)
    pitch_name = serializers.CharField(source='pitch.name', read_only=True)
    class Meta:
        model = Investment
        fields = '__all__'