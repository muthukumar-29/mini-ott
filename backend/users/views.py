from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer
from .models import UserProfile


class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class RegisterView(APIView):
    """Public registration - creates VIEWER accounts"""
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data.copy()
        # Force role to VIEWER for public registration
        data['role'] = 'VIEWER'
        data['is_active'] = True

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': 'VIEWER',
            }, status=201)
        return Response(serializer.errors, status=400)


class ProfileView(APIView):
    """Get/Update logged-in user's profile"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = getattr(user, 'userprofile', None)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': profile.role if profile else 'VIEWER',
            'date_joined': user.date_joined,
        })

    def patch(self, request):
        user = request.user
        data = request.data

        if 'first_name' in data:
            user.first_name = data['first_name']
        if 'last_name' in data:
            user.last_name = data['last_name']
        if 'email' in data:
            user.email = data['email']
        user.save()

        profile = getattr(user, 'userprofile', None)
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': profile.role if profile else 'VIEWER',
        })