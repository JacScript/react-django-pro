from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Book
from .serializer import BookSerializer

@api_view(['GET'])
def get_books(request):
    books = Book.objects.all()
    serializerData = BookSerializer(books, many=True)
    return Response(serializerData .data)

@api_view(['POST'])
def create_book(request):
    serializerData = BookSerializer(data=request.data)
    if serializerData.is_valid():
        serializerData.save()
        return Response(serializerData.data, status=status.HTTP_201_CREATED)
    return Response(serializerData.errors, status=status.HTTP_400_BAD_REQUEST) 

@api_view(['PUT', 'DELETE'])
def book_detail(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializerData = BookSerializer(book, data=request.data)
        if serializerData.is_valid():
            serializerData.save()
            return Response(serializerData.data)
        return Response(serializerData.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

 