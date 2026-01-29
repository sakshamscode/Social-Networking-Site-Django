from rest_framework import serializers
from .models import User, Post

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=6)
    class Meta:
        model = User
        fields = ['email', 'password', 'full_name', 'dob', 'profile_pic']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # hashes password properly
        user.save()
        return user
    


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)



class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'full_name', 'dob', 'profile_pic', 'date_joined']
        read_only_fields = ['email', 'date_joined']

    

class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'email', 'profile_pic','dob']



class PostSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)
    like_count = serializers.IntegerField(source='likes.count', read_only=True)

    # allow empty content and optional image
    content = serializers.CharField(required=False, allow_blank=True)
    image = serializers.ImageField(required=False, allow_null=True)
    class Meta:                                    
        model = Post
        fields = ['id', 'user', 'content', 'image', 'created_at', 'like_count']
        read_only_fields = ['id', 'user', 'created_at', 'like_count']
    

