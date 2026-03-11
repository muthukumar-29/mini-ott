from django.shortcuts import render

# Create your views here.
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser
from .models import SubscriptionPlan
from .serializers import SubscriptionPlanSerializer

class SubscriptionPlanViewSet(ModelViewSet):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [IsAdminUser]
