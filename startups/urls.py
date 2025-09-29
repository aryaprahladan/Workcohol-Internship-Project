from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_startup, name='create_startup'),
    path('<int:pk>/', views.startup_detail, name='startup_detail'),
    path('<int:pk>/invest/', views.make_investment, name='make_investment'),
    path('<int:pk>/status/<str:status>/', views.update_startup_status, name='update_startup_status'),
]