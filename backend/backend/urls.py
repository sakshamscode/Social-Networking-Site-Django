"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
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
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from core.views import SignupView, LoginView, ProfileView, PostView, PostDeleteView, LikePostView
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/signup/', SignupView.as_view()),    #user register
    path('api/login/', LoginView.as_view()),      #user login
    path('api/profile/', ProfileView.as_view()),  #fetch profile
    path("api/posts/", PostView.as_view()),                     # Create + Get All Posts
    path("api/posts/<int:post_id>/delete/", PostDeleteView.as_view()),   # Delete Post
    path("api/posts/<int:post_id>/like/", LikePostView.as_view()),       # Like / Unlike
]

if settings.DEBUG:
    urlpatterns+=static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
