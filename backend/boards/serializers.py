from rest_framework import serializers
from .models import Board, List, Task
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class TaskSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)
    assignee_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'list', 'assignee', 'assignee_id',
            'priority', 'due_date', 'position', 'completed', 'created_at', 'updated_at'
        ]

class ListSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    tasks_count = serializers.SerializerMethodField()

    class Meta:
        model = List
        fields = ['id', 'title', 'board', 'position', 'tasks', 'tasks_count', 'created_at', 'updated_at']

    def get_tasks_count(self, obj):
        return obj.tasks.count()

class BoardSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    lists = ListSerializer(many=True, read_only=True)
    lists_count = serializers.SerializerMethodField()
    tasks_count = serializers.SerializerMethodField()

    class Meta:
        model = Board
        fields = [
            'id', 'title', 'description', 'owner', 'members', 'lists',
            'lists_count', 'tasks_count', 'created_at', 'updated_at'
        ]

    def get_lists_count(self, obj):
        return obj.lists.count()

    def get_tasks_count(self, obj):
        return Task.objects.filter(list__board=obj).count()

# Simplified serializer for listing boards (without nested data)
class BoardListSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    lists_count = serializers.SerializerMethodField()
    tasks_count = serializers.SerializerMethodField()

    class Meta:
        model = Board
        fields = [
            'id', 'title', 'description', 'owner',
            'lists_count', 'tasks_count', 'created_at', 'updated_at'
        ]

    def get_lists_count(self, obj):
        return obj.lists.count()

    def get_tasks_count(self, obj):
        return Task.objects.filter(list__board=obj).count()