from django.urls import path
from .views import PitchListCreate, InvestmentListCreate, RegisterView, CustomAuthToken, PitchCreateView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomAuthToken.as_view(), name='login'),
    path('pitches/', PitchListCreate.as_view(), name='pitches'),
    path('pitches/create/', PitchCreateView.as_view(), name='pitch-create'),
    path('investments/', InvestmentListCreate.as_view(), name='investment-list'),
]