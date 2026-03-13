from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Comment, CommentLike
from .serializers import CommentSerializer


class CommentViewSet(ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Comment.objects.filter(is_approved=True)
        film_id = self.request.query_params.get('film')
        if film_id:
            queryset = queryset.filter(film_id=film_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        comment = self.get_object()
        like, created = CommentLike.objects.get_or_create(
            comment=comment, user=request.user
        )
        if not created:
            like.delete()
            return Response({'liked': False, 'likes_count': comment.likes.count()})
        return Response({'liked': True, 'likes_count': comment.likes.count()})

    @action(detail=False, methods=['get'])
    def all(self, request):
        """Admin endpoint to get all comments including unapproved"""
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        queryset = Comment.objects.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        """Admin toggle comment approval"""
        if not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)
        comment = self.get_object()
        comment.is_approved = not comment.is_approved
        comment.save()
        return Response({'is_approved': comment.is_approved})