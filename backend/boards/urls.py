from django.urls import path
from . import views

urlpatterns = [
    # Board endpoints
    path('boards/', views.BoardListCreateView.as_view(), name='board-list-create'),
    path('boards/<int:pk>/', views.BoardDetailView.as_view(), name='board-detail'),
    
    # List endpoints
    path('lists/', views.ListCreateView.as_view(), name='list-create'),
    path('lists/<int:pk>/', views.ListDetailView.as_view(), name='list-detail'),
    
    # Task endpoints
    path('tasks/', views.TaskCreateView.as_view(), name='task-create'),
    path('tasks/<int:pk>/', views.TaskDetailView.as_view(), name='task-detail'),
]