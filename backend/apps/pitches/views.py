from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Pitch, Investment
from .serializers import PitchSerializer, InvestmentSerializer
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response

class RegisterView(APIView):
    def get(self, request):
        return Response({"message": "Registration endpoint. Please use POST to register."})
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Username and password required'}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)
        user = User.objects.create_user(username=username, password=password)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({'token': token.key})

class PitchListCreate(generics.ListCreateAPIView):
    queryset = Pitch.objects.all().order_by('-created_at')
    serializer_class = PitchSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        serializer.save(founder=self.request.user)

class InvestmentListCreate(generics.ListCreateAPIView):
    queryset = Investment.objects.all()
    serializer_class = InvestmentSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        from django.contrib.auth.models import User
        default_user = User.objects.first()
        serializer.save(investor=default_user)

class PitchCreateView(generics.CreateAPIView):
    queryset = Pitch.objects.all()
    serializer_class = PitchSerializer
    permission_classes = [permissions.AllowAny]