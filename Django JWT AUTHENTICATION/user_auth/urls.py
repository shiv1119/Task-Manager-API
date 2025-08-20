from django.urls import path
from user_auth.views import RegisterView, HelloView, ProfileView, DeleteUserView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('hello/', HelloView.as_view(), name='hello'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('api/user/delete/', DeleteUserView.as_view(), name='delete_user'),
]
