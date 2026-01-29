from django.shortcuts import render
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import SignupSerializer, LoginSerializer, ProfileSerializer, PostSerializer
from .models import Post


class SignupView(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = authenticate(username=email, password=password)
             
            if user:
                user.last_login = timezone.now()
                user.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "Login successful",
                    "refresh": str(refresh),
                    "access": str(refresh.access_token)
                }, status=200)

            return Response({"error": "Invalid email or password"}, status=400)

        return Response(serializer.errors, status=400)



class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Profile updated successfully"})
        return Response(serializer.errors, status=400)


class PostView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
      serializer = PostSerializer(data=request.data)
      if serializer.is_valid():
        post = serializer.save(user=request.user)
        return Response(PostSerializer(post).data, status=201)
      return Response(serializer.errors, status=400)


    def get(self, request):
        posts = Post.objects.all().order_by("-created_at")      #post of all user will be displayed
        #posts = Post.objects.filter(user=request.user).order_by("-created_at") #post of only logged in user will be displayed
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)




class PostDeleteView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id, user=request.user)
        except Post.DoesNotExist:
            return Response({"error": "Post not found or not yours"}, status=404)

        post.delete()
        return Response({"message": "Post deleted successfully"})



class LikePostView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=404)

        if request.user in post.likes.all():
            post.likes.remove(request.user)
            return Response({"message": "Post unliked"})
        else:
            post.likes.add(request.user)
            return Response({"message": "Post liked"})

# Create your views here.
