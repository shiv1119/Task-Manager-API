from rest_framework import serializers
from .models import Task


class TaskSerializers(serializers.Serializer):
    id = serializers.IntegerField(read_only = True)
    title = serializers.CharField(max_length = 200)
    description = serializers.CharField()
    status = serializers.BooleanField(default=False)
    due_date = serializers.DateTimeField()
    created_at = serializers.DateTimeField(read_only=True)
    

    def create(self, validated_data):
        return Task.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.due_date = validated_data.get('due_date', instance.due_date)
        instance.save()
        return instance
