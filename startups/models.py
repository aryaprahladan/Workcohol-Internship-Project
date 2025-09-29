from django.db import models
from accounts.models import CustomUser

class Startup(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending Review'),
        ('approved', 'Approved'),
        ('declined', 'Declined'),
        ('partially_funded', 'Partially Funded'),
        ('fully_funded', 'Fully Funded'),
    )
    
    INDUSTRY_CHOICES = (
        ('tech', 'Technology'),
        ('healthcare', 'Healthcare'),
        ('finance', 'Finance'),
        ('education', 'Education'),
        ('ecommerce', 'E-Commerce'),
        ('other', 'Other'),
    )
    
    founder = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'user_type': 'founder'})
    title = models.CharField(max_length=200)
    description = models.TextField()
    problem_statement = models.TextField()
    solution = models.TextField()
    unique_value_proposition = models.TextField()
    target_market = models.TextField()
    business_model = models.TextField()
    competitive_analysis = models.TextField()
    funding_amount = models.DecimalField(max_digits=12, decimal_places=2)
    funds_raised = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    equity_offered = models.DecimalField(max_digits=5, decimal_places=2)
    industry = models.CharField(max_length=20, choices=INDUSTRY_CHOICES)
    founding_date = models.DateField()
    team_size = models.IntegerField()
    website = models.URLField(blank=True)
    pitch_deck = models.FileField(upload_to='pitch_decks/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    
    def get_funding_percentage(self):
        if self.funding_amount > 0:
            return (self.funds_raised / self.funding_amount) * 100
        return 0

class Investment(models.Model):
    investor = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'user_type': 'investor'})
    startup = models.ForeignKey(Startup, on_delete=models.CASCADE)
    amount_invested = models.DecimalField(max_digits=12, decimal_places=2)
    equity_acquired = models.DecimalField(max_digits=5, decimal_places=2)
    investment_date = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        unique_together = ['investor', 'startup']
    
    def __str__(self):
        return f"{self.investor.username} invested ${self.amount_invested} in {self.startup.title}"