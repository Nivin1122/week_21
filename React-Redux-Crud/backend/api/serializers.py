# serializers.py
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'profile_image', 'password', 'is_active']
        extra_kwargs = {
            'password': {'write_only': True},
            'profile_image': {'allow_null': True}
        }

    def create(self, validated_data):
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])  
        user.save()
        return user
    
    def update(self, instance, validated_data):
        if 'password' in validated_data:
            instance.set_password(validated_data.pop('password'))
        return super().update(instance, validated_data)




class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['user_id'] = user.id

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data['user_id'] = self.user.id
        data['username'] = self.user.username
        data['profile_image'] = self.user.profile_image.url if self.user.profile_image else None
        data['is_active'] = self.user.is_active

        return data
    

class EditUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'profile_image'] 
        extra_kwargs = {
            'username': {'required': True, 'allow_blank': False}, 
            'profile_image': {'allow_null': True},
            'password': {'required': False}  
        }

    def update(self, instance, validated_data):
        
        username = validated_data.get('username', instance.username)
        instance.username = username
        instance.save()
        return instance