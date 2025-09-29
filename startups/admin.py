from django.contrib import admin
from .models import Startup, Investment

@admin.register(Startup)
class StartupAdmin(admin.ModelAdmin):
    list_display = ('title', 'founder', 'funding_amount', 'funds_raised', 'status', 'created_at')
    list_filter = ('status', 'industry', 'created_at')
    search_fields = ('title', 'founder__username', 'description')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    list_display = ('investor', 'startup', 'amount_invested', 'equity_acquired', 'investment_date')
    list_filter = ('investment_date',)
    search_fields = ('investor__username', 'startup__title')