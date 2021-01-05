from django.urls import path
from .views import *

urlpatterns = [
    path('room', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', GetRoom.as_view()),
    path('join-room', JoinRom.as_view()),
    path('user-in-room', UserInRoom.as_view()),
    path('leave-room', LeaveRoom.as_view()),
    path('update-room', updateRoom.as_view()),
]