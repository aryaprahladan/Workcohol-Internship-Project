from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import FounderRegistrationForm, InvestorRegistrationForm
from .models import CustomUser

def home(request):
    return render(request, 'base.html')

def register_choice(request):
    return render(request, 'accounts/register_choice.html')

def register_founder(request):
    if request.method == 'POST':
        form = FounderRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f'Welcome {user.username}! Your founder account has been created successfully.')
            return redirect('dashboard')
        else:
            messages.error(request, 'Please correct the errors below.')
    else:
        form = FounderRegistrationForm()
    return render(request, 'accounts/register_founder.html', {'form': form})

def register_investor(request):
    if request.method == 'POST':
        form = InvestorRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            
            # Log the user in after registration
            login(request, user)
            
            messages.success(
                request, 
                f'Welcome {user.username}! Your investor account has been created successfully. '
                f'Start exploring investment opportunities!'
            )
            return redirect('dashboard')
        else:
            # Display form errors
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, f'{field}: {error}')
    else:
        form = InvestorRegistrationForm()
    
    return render(request, 'accounts/register_investor.html', {'form': form})

@login_required
def dashboard(request):
    user = request.user
    context = {'user': user}
    
    if user.user_type == 'founder':
        from startups.models import Startup
        startups = Startup.objects.filter(founder=user).order_by('-created_at')
        context['startups'] = startups
        return render(request, 'accounts/founder_dashboard.html', context)
    
    elif user.user_type == 'investor':
        from startups.models import Startup, Investment
        startups = Startup.objects.all().order_by('-created_at')
        investments = Investment.objects.filter(investor=user).select_related('startup')
        context.update({
            'startups': startups,
            'investments': investments
        })
        return render(request, 'accounts/investor_dashboard.html', context)
    
    return redirect('home')