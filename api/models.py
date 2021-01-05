from django.db import models
import string,random

#Code generation function
def generate():
    length = 7
    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if Room.objects.filter(code=code).count() == 0:
            break

    return code


# Create your models here.
class Room(models.Model):

    code = models.CharField(max_length=10, default=generate, unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null = False, default=False)
    votes_to_skip = models.IntegerField(null = False,default=1)
    created_at = models.DateTimeField(auto_now_add= True)
    current_song =models.CharField(max_length=50, null = True)
    
    
    