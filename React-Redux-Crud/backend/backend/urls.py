"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, AdminTokenObtainPairView,AdminOnlyView, ListUsersView, ToggleUserStatusView,AdminTokenObtainPairView, UserViewSet, UserProfileView,CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf.urls.static import static 
from django.conf import settings


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name='register'),  
    path("api/token", CustomTokenObtainPairView.as_view(), name="get_token"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api/admin/login/', AdminTokenObtainPairView.as_view(), name="admin_login"),
    path('api/admin/', AdminOnlyView.as_view(), name='admin_only'),
    path('api/admin/users/', ListUsersView.as_view(), name='list_users'),
    path('api/admin/login/', AdminTokenObtainPairView.as_view(), name='admin_login'),  
    path('api/users/<int:pk>/', UserViewSet.as_view({'get': 'retrieve', 'put': 'update'}), name='user-detail'),
    path('api/admin/users/toggle/<int:pk>/', ToggleUserStatusView.as_view(), name='toggle_user_status'),
    path('api/auth/', include('rest_framework.urls')),
    path('api/', include('api.urls')),
    path('api/user/<int:pk>/', UserProfileView.as_view()),
]

if settings.DEBUG:  
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)