from django.urls import path
from .views import HomeView, TaskListCreateApiView, TaskDeatilAPIView
urlpatterns = [
    path("", HomeView.as_view(), name="home-view"),
    path("tasks/", TaskListCreateApiView.as_view(), name="create_task"),
    path("tasks/<int:pk>/", TaskDeatilAPIView.as_view(), name="detailed_task")
]
