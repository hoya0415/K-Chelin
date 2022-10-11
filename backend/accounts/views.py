from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer
from .models import User


@api_view(['POST'])
def signup(request):
    
    if request.data.get('password') != request.data.get('password2'):
        return Response({ 'error': '비밀번호 확인해주세요.' }, status.HTTP_400_BAD_REQUEST)

    serializer = UserSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        user = serializer.save()
        user.set_password(request.data.get('password'))
        user.save()
        return Response(serializer.data, status.HTTP_201_CREATED)


@api_view(['DELETE'])
def user_delete(request):
    user = User.objects.filter(username=request.user)
    user.delete()

    return Response({ 'message': '성공적으로 탈퇴하였습니다.' }, status.HTTP_200_OK)
