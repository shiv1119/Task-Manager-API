from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class UserTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="shiv", email="shiv@gmail.com", password="Shiv@6499")
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.auth_header = f"Bearer {self.token}"
    def test_registration_success(self):
        url = reverse("register")
        data = {
            "username": "newuser",
            "email": "newuser@gmail.com",
            "password": "NewUser@123",
            "password2": "NewUser@123"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_registration_password_mismatch(self):
        url = reverse("register")
        data = {
            "username": "user2",
            "email": "user2@gmail.com",
            "password": "Pass123!",
            "password2": "Pass124!"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_jwt_login_success(self):
        url = reverse("token_obtain_pair")
        data = {"username": "shiv", "password": "Shiv@6499"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_jwt_login_failure(self):
        url = reverse("token_obtain_pair")
        data = {"username": "shiv", "password": "wrongpassword"}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_profile(self):
        url = reverse("profile")
        self.client.credentials(HTTP_AUTHORIZATION=self.auth_header)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['full_name'], "")

    def test_update_profile(self):
        url = reverse("profile")
        self.client.credentials(HTTP_AUTHORIZATION=self.auth_header)
        data = {"full_name": "Shiv Nandan Verma", "bio": "Software Developer"}
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["full_name"], "Shiv Nandan Verma")
        self.assertEqual(response.data["bio"], "Software Developer")

    def test_delete_user(self):
        url = reverse("delete_user")
        self.client.credentials(HTTP_AUTHORIZATION=self.auth_header)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(username="shiv").exists())
