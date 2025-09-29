from django import forms
from .models import Investment
from .models import Startup

class StartupForm(forms.ModelForm):
    class Meta:
        model = Startup
        fields = [
            'title', 'description', 'problem_statement', 'solution',
            'unique_value_proposition', 'target_market', 'business_model',
            'competitive_analysis', 'funding_amount', 'equity_offered',
            'industry', 'founding_date', 'team_size', 'website', 'pitch_deck'
        ]
        widgets = {
            'founding_date': forms.DateInput(attrs={'type': 'date'}),
            'description': forms.Textarea(attrs={'rows': 4}),
            'problem_statement': forms.Textarea(attrs={'rows': 4}),
            'solution': forms.Textarea(attrs={'rows': 4}),
            'unique_value_proposition': forms.Textarea(attrs={'rows': 3}),
            'target_market': forms.Textarea(attrs={'rows': 3}),
            'business_model': forms.Textarea(attrs={'rows': 4}),
            'competitive_analysis': forms.Textarea(attrs={'rows': 4}),
        }

class InvestmentForm(forms.ModelForm):
    class Meta:
        model = Investment
        fields = ['amount_invested', 'equity_acquired', 'notes']
        widgets = {
            'notes': forms.Textarea(attrs={'rows': 3}),
        }