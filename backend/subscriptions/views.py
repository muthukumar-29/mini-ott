from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, AllowAny
from .models import SubscriptionPlan
from .serializers import SubscriptionPlanSerializer


class SubscriptionPlanViewSet(ModelViewSet):
    serializer_class = SubscriptionPlanSerializer

    def get_queryset(self):
        # Only show active plans to public
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return SubscriptionPlan.objects.all()
        return SubscriptionPlan.objects.filter(is_active=True)

    def get_permissions(self):
        # Anyone can list / retrieve plans (needed by OTT Subscriptions page)
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            # Only admins can create / update / delete plans
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]