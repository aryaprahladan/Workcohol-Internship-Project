from django.urls import path
from .views import PitchListCreateView, PitchRetrieveUpdateDestroyView, InvestmentCreateView, InvestmentListView

urlpatterns = [
    path('', PitchListCreateView.as_view(), name='pitch-list-create'),
    path('<int:pk>/', PitchRetrieveUpdateDestroyView.as_view(), name='pitch-detail'),
    path('<int:pitch_id>/invest/', InvestmentCreateView.as_view(), name='investment-create'),
    path('investments/', InvestmentListView.as_view(), name='investment-list'),
]