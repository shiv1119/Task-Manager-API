from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializers
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
# Create your views here.

class HomeView(APIView):
    def get(self, request):
        return Response({"message": "Hello world"})
    

class TaskListCreateApiView(APIView):

    @swagger_auto_schema(
            responses={
                200: TaskSerializers(many=True)
            },
            operation_description="Reterieve list of tasks"
    )
    def get(self, request):
        tasks = Task.objects.all()
        serialized_data = TaskSerializers(tasks, many=True)

        return Response(serialized_data.data)
    
    @swagger_auto_schema(
        request_body=TaskSerializers,
        responses={
            201: TaskSerializers()
        },
        operation_description="Create a new task"
    )
    def post(self, request):
        serializer =  TaskSerializers(data = request.data)
        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class TaskDeatilAPIView(APIView):

    @swagger_auto_schema(
        responses={200: TaskSerializers()},
        operation_description="Retrieve a single task by its ID"
    )
    def get(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = TaskSerializers(task)
        return Response(serializer.data)
    
    @swagger_auto_schema(
        request_body=TaskSerializers,
        responses={200: TaskSerializers()},
        operation_description="Update an existing task by its ID"
    )
    def put(self, request, pk):
        try:
            task = Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = TaskSerializers(task, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    


