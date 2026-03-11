from django.db import models

# Create your models here.
class SubscriptionPlan(models.Model):
    PLAN_TYPE_CHOICES = (
        ('FREE', 'Free'),
        ('MONTHLY', 'Monthly'),
        ('YEARLY', 'Yearly'),
    )

    name = models.CharField(max_length=100)
    plan_type = models.CharField(max_length=20, choices=PLAN_TYPE_CHOICES)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    duration_days = models.IntegerField(help_text="Validity in days")
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

from django.utils import timezone
from django.contrib.auth.models import User

class UserSubscription(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def is_valid(self):
        return self.is_active and self.end_date >= timezone.now()

    def __str__(self):
        return f"{self.user.username} - {self.plan.name if self.plan else 'No Plan'}"
