from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import ShortFilm
from .serializers import ShortFilmSerializer
from .permissions import IsAdmin, IsAdminOrCreator
from .subscription_utils import user_has_active_subscription

class ShortFilmViewSet(ModelViewSet):
    queryset = ShortFilm.objects.all()
    serializer_class = ShortFilmSerializer

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAdminOrCreator]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsAdmin]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user

        if user.userprofile.role == 'ADMIN':
            return ShortFilm.objects.all()

        if user_has_active_subscription(user):
            return ShortFilm.objects.filter(status='APPROVED')

        return ShortFilm.objects.filter(
            status='APPROVED',
            is_premium=False
        )

    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user)
