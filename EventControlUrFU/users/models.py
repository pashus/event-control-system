from django.db import models
from django.contrib.auth.models import AbstractUser


class MyUser(AbstractUser):
    access_level = models.CharField(max_length=20, blank=True)