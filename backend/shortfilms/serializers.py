from rest_framework import serializers
from .models import ShortFilm

class ShortFilmSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortFilm
        fields = '__all__'
        read_only_fields = ['uploaded_by', 'status', 'views']
