from django.shortcuts import render
from rest_framework import generics, permissions, filters
from .models import Pitch, Investment
from .serializers import PitchSerializer, InvestmentSerializer
from users.models import CustomUser

class PitchListCreateView(generics.ListCreateAPIView):
    serializer_class = PitchSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'industry']

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'founder':
            return Pitch.objects.filter(founder=user)
        return Pitch.objects.filter(status='submitted')

    def perform_create(self, serializer):
        serializer.save(founder=self.request.user)

class PitchRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pitch.objects.all()
    serializer_class = PitchSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'founder':
            return Pitch.objects.filter(founder=user)
        return Pitch.objects.all()

class InvestmentCreateView(generics.CreateAPIView):
    queryset = Investment.objects.all()
    serializer_class = InvestmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(investor=self.request.user)

class InvestmentListView(generics.ListAPIView):
    serializer_class = InvestmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'investor':
            return Investment.objects.filter(investor=user)
        return Investment.objects.filter(pitch__founder=user)
