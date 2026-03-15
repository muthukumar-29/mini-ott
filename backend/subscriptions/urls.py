from rest_framework.routers import DefaultRouter
from .views import SubscriptionPlanViewSet

router = DefaultRouter()
# OTT fetches GET /api/subscriptions/plans/ — keep "plans" as the prefix
router.register('subscriptions/plans', SubscriptionPlanViewSet, basename='subscription-plan')

urlpatterns = router.urls