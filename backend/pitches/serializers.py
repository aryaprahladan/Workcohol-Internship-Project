from rest_framework import serializers
from .models import Pitch, Investment
from users.serializers import UserSerializer

class PitchSerializer(serializers.ModelSerializer):
    founder = UserSerializer(read_only=True)
    
    class Meta:
        model = Pitch
        fields = '__all__'
        read_only_fields = ('founder', 'created_at', 'updated_at', 'status')

class InvestmentSerializer(serializers.ModelSerializer):
    investor = UserSerializer(read_only=True)
    pitch = PitchSerializer(read_only=True)
    
    class Meta:
        model = Investment
        fields = '__all__'
        read_only_fields = ('investor', 'created_at', 'is_approved')