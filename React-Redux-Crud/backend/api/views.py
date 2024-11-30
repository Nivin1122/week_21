from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer, EditUserSerializer, CustomTokenObtainPairSerializer 
from .models import CustomUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework import viewsets


class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all() 
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        token = serializer.validated_data['access']  

        user = serializer.user  

        response_data = {
            'access': str(token),
            'refresh': str(serializer.validated_data['refresh']), 
            'user_id': user.id,  
            'username': user.username, 
            'profile_image': user.profile_image.url if user.profile_image else None, 
            'is_active': user.is_active  
        }

        return Response(response_data, status=status.HTTP_200_OK)


class AdminTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None and user.is_superuser:
            refresh = RefreshToken.for_user(user)

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'isSuperuser': user.is_superuser,
                'isActive': user.is_active,  
            })
        else:
            return Response(
                {"detail": "You are not authorized to access this area"},
                status=status.HTTP_401_UNAUTHORIZED
            )


class AdminOnlyView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({"message": "Welcome Admin"})


class ListUsersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = CustomUser.objects.filter(is_superuser=False)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    

class ToggleUserStatusView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk) 
            user.is_active = not user.is_active 
            user.save()
            return Response({'message': 'User status updated successfully'}, status=status.HTTP_200_OK)
        except CustomUser.DoesNotExist:  
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = EditUserSerializer
    permission_classes = [IsAuthenticated]
    


class UserProfileView(APIView):
    def get(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)