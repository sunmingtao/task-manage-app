from django.db import models
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import Board, List, Task
from .serializers import BoardSerializer, BoardListSerializer, ListSerializer, TaskSerializer

class BoardListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Return boards where user is owner or member
        user = self.request.user
        return Board.objects.filter(
            models.Q(owner=user) | models.Q(members=user)
        ).distinct()

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
        user = self.request.user
        return Board.objects.filter(
            models.Q(owner=user) | models.Q(members=user)
        ).distinct()

class ListCreateView(generics.CreateAPIView):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        board_id = self.request.data.get('board')
        board = get_object_or_404(Board, id=board_id)
        
        # Check if user has access to this board
        if not (board.owner == self.request.user or self.request.user in board.members.all()):
            raise permissions.PermissionDenied("You don't have permission to add lists to this board")
        
        # Set position to be last in the board
        last_position = board.lists.count()
        serializer.save(position=last_position)

class ListDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return List.objects.filter(
            models.Q(board__owner=user) | models.Q(board__members=user)
        ).distinct()

class TaskCreateView(generics.CreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        list_id = self.request.data.get('list')
        task_list = get_object_or_404(List, id=list_id)
        
        # Check if user has access to this list's board
        if not (task_list.board.owner == self.request.user or self.request.user in task_list.board.members.all()):
            raise permissions.PermissionDenied("You don't have permission to add tasks to this list")
        
        # Set position to be last in the list
        last_position = task_list.tasks.count()
        serializer.save(position=last_position)

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(
            models.Q(list__board__owner=user) | models.Q(list__board__members=user)
        ).distinct()