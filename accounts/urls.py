from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_choice, name='register_choice'),
    path('register/founder/', views.register_founder, name='register_founder'),
    path('register/investor/', views.register_investor, name='register_investor'),
    path('dashboard/', views.dashboard, name='dashboard'),
]