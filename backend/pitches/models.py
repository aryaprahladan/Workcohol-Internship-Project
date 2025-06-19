from django.db import models
from users.models import CustomUser

class Pitch(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('submitted', 'Submitted'),
        ('under_review', 'Under Review'),
        ('funded', 'Funded'),
        ('rejected', 'Rejected'),
    )
    
    founder = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='pitches')
    title = models.CharField(max_length=200)
    description = models.TextField()
    business_plan = models.TextField()
    funding_goal = models.DecimalField(max_digits=10, decimal_places=2)
    equity_offered = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    industry = models.CharField(max_length=100)
    
    def __str__(self):
        return self.title

class Investment(models.Model):
    investor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='investments')
    pitch = models.ForeignKey(Pitch, on_delete=models.CASCADE, related_name='investments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_approved = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.investor.username} invested ${self.amount} in {self.pitch.title}"
