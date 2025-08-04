from django.db import models
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import Board, List, Task
from .serializers import BoardSerializer, BoardListSerializer, ListSerializer, TaskSerializer, UserSerializer
from django.contrib.auth.models import User

class BoardListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return all boards visible to all authenticated users
        return Board.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return BoardListSerializer
        return BoardSerializer

    def perform_create(self, serializer):
        # Set the current user as the owner
        board = serializer.save(owner=self.request.user)
        # Add creator as a member
        board.members.add(self.request.user)

class BoardDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Allow all authenticated users to view any board
        return Board.objects.all()

class ListCreateView(generics.CreateAPIView):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        board_id = self.request.data.get('board')
        board = get_object_or_404(Board, id=board_id)
        
        # Allow any authenticated user to add lists to any board
        # Set position to be last in the board
        last_position = board.lists.count()
        serializer.save(position=last_position)

class ListDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Allow all authenticated users to access any list
        return List.objects.all()

class TaskCreateView(generics.CreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        list_id = self.request.data.get('list')
        task_list = get_object_or_404(List, id=list_id)
        
        # Allow any authenticated user to add tasks to any list
        # Set position to be last in the list
        last_position = task_list.tasks.count()
        serializer.save(position=last_position)

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Allow all authenticated users to access any task
        return Task.objects.all()

class BoardUsersView(generics.ListAPIView):
    """Get all users for task assignment dropdown"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return all users so tasks can be assigned to anyone
        return User.objects.all()