from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Startup, Investment
from .forms import StartupForm, InvestmentForm

@login_required
def create_startup(request):
    if request.user.user_type != 'founder':
        messages.error(request, "Only founders can create startups.")
        return redirect('dashboard')
    
    if request.method == 'POST':
        form = StartupForm(request.POST, request.FILES)
        if form.is_valid():
            startup = form.save(commit=False)
            startup.founder = request.user
            startup.save()
            messages.success(request, "Startup created successfully!")
            return redirect('dashboard')
    else:
        form = StartupForm()
    
    return render(request, 'startups/create_startup.html', {'form': form})

@login_required
def startup_detail(request, pk):
    startup = get_object_or_404(Startup, pk=pk)
    investments = Investment.objects.filter(startup=startup)
    
    context = {
        'startup': startup,
        'investments': investments,
    }
    
    if request.user.user_type == 'investor':
        # Check if investor has already invested
        existing_investment = Investment.objects.filter(
            investor=request.user, 
            startup=startup
        ).first()
        context['existing_investment'] = existing_investment
        context['investment_form'] = InvestmentForm()
    
    return render(request, 'startups/startup_detail.html', context)

@login_required
def make_investment(request, pk):
    if request.user.user_type != 'investor':
        messages.error(request, "Only investors can make investments.")
        return redirect('dashboard')
    
    startup = get_object_or_404(Startup, pk=pk)
    
    if request.method == 'POST':
        form = InvestmentForm(request.POST)
        if form.is_valid():
            investment = form.save(commit=False)
            investment.investor = request.user
            investment.startup = startup
            
            # Update startup funding status
            startup.funds_raised += investment.amount_invested
            
            if startup.funds_raised >= startup.funding_amount:
                startup.status = 'fully_funded'
            elif startup.funds_raised > 0:
                startup.status = 'partially_funded'
            
            startup.save()
            investment.save()
            
            messages.success(request, f"Successfully invested ${investment.amount_invested} in {startup.title}")
            return redirect('dashboard')
    
    return redirect('startup_detail', pk=pk)

@login_required
def update_startup_status(request, pk, status):
    if request.user.user_type != 'investor':
        messages.error(request, "Only investors can update startup status.")
        return redirect('dashboard')
    
    startup = get_object_or_404(Startup, pk=pk)
    
    if status in ['approved', 'declined']:
        startup.status = status
        startup.save()
        messages.success(request, f"Startup status updated to {status}.")
    
    return redirect('dashboard')