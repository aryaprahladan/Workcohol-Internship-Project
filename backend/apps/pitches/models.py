from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Pitch(models.Model):
    name = models.CharField(max_length=100, default="")
    industry = models.CharField(max_length=100, default="")
    stage = models.CharField(max_length=100, default="")
    funding = models.CharField(max_length=100, default="0")
    goal = models.CharField(max_length=100, default="0")
    date = models.DateField(default=timezone.now)
    description = models.TextField(default="")
    created_at = models.DateTimeField(auto_now_add=True)

class Investment(models.Model):
    investor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='investments')
    pitch = models.ForeignKey(Pitch, on_delete=models.CASCADE, related_name='investments')
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)