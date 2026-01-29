from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        return self.create_user(email, password, **extra_fields)
    
class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    full_name = models.CharField(max_length=255)
    dob = models.DateField(null=True, blank=True)
    profile_pic = models.ImageField(upload_to='profiles/', null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # email is username field so remove username from required
    
    objects = UserManager()
    
    def __str__(self):
        return self.email
    


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    image = models.ImageField(upload_to="posts/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    likes = models.ManyToManyField(User, related_name="liked_posts", blank=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.content[:30]}"


# Create your models here.
