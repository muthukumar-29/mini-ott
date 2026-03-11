from rest_framework.routers import DefaultRouter
from .views import SubscriptionPlanViewSet

router = DefaultRouter()
router.register('subscriptions', SubscriptionPlanViewSet)

urlpatterns = router.urls
