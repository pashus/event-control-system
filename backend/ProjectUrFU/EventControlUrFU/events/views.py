from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import EventSerializer, PlayerSerializer
import eventDB.eventDB as eventDB


class EventsView(APIView):
    def get(self, request):
        db = eventDB.EventDB()
        data = db.get_events()
        db.close()

        if len(data) <= 0:
            return Response({"error": "События отсутствуют или в них ошибка!"}, status=status.HTTP_404_NOT_FOUND)

        serializer = EventSerializer(instance=data, many=True)

        # Реализация пагинации по query-параметрам (React Admin присылает range=[start, end])
        try:
            import json
            range_param = request.GET.get('range')
            if range_param:
                start, end = json.loads(range_param)
                sliced_data = data[start:end+1]
                serializer = EventSerializer(instance=sliced_data, many=True)
                content_range = f'items {start}-{end}/{len(data)}'
            else:
                content_range = f'items 0-{len(data)-1}/{len(data)}'
        except Exception:
            # На случай некорректного range
            content_range = f'items 0-{len(data)-1}/{len(data)}'

        response = Response(serializer.data, status=status.HTTP_200_OK)
        response['Content-Range'] = content_range
        response['Access-Control-Expose-Headers'] = 'Content-Range'  # обязательно для CORS!
        return response

    def post(self, request):
        serializer = EventSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        db = eventDB.EventDB()
        event_id = db.new_event(data['name'], data['description'], data['start_time'], data['end_time'], data['location'], '{"name": "some event"}') 
        created_event = db.get_event(event_id)
        serializer = EventSerializer(instance=created_event)
        db.close()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class EventView(APIView):
    def get(self, request, pk):
        db = eventDB.EventDB()
        data = db.get_event(pk)
        db.close()
        serializer = EventSerializer(instance=data)
        if data is None:
            return Response({"error": "Событие не найдено!"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, pk):
        db = eventDB.EventDB()
        data = db.get_event(pk)
        if data is None:
            return Response({"error": "Событие не найдено!"}, status=status.HTTP_404_NOT_FOUND)
        db.delete_event(pk)
        db.close()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class PlayersView(APIView):
    def get(self, request, pk):
        db = eventDB.EventDB()
        data = db.get_players(pk)
        db.close()
        serializer = PlayerSerializer(instance=data, many=True)
        if len(data) <= 0:
            return Response({"error": "Участники отсутствуют или в них ошибка!"})
        
        try:
            import json
            range_param = request.GET.get('range')
            if range_param:
                start, end = json.loads(range_param)
                sliced_data = data[start:end+1]
                serializer = EventSerializer(instance=sliced_data, many=True)
                content_range = f'items {start}-{end}/{len(data)}'
            else:
                content_range = f'items 0-{len(data)-1}/{len(data)}'
        except Exception:
            # На случай некорректного range
            content_range = f'items 0-{len(data)-1}/{len(data)}'

        response = Response(serializer.data, status=status.HTTP_200_OK)
        response['Content-Range'] = content_range
        response['Access-Control-Expose-Headers'] = 'Content-Range'  # обязательно для CORS!
        return response

    def post(self, request, pk):
        serializer = PlayerSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        db = eventDB.EventDB()
        db.new_player(pk, data['first_name'], data['last_name'], data['group_name'])
        db.close()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class PlayerView(APIView):
    def get(self, request, event_id, player_id):
        db = eventDB.EventDB()
        data = db.get_player(event_id=event_id, player_id=player_id)
        db.close()
        serializer = PlayerSerializer(instance=data)
        if data is None:
            return Response({"error": "Участник не найден!"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, event_id, player_id):
        db = eventDB.EventDB()
        data = db.get_player(event_id=event_id, player_id=player_id)
        if data is None:
            return Response({"error": "Участник не найден!"}, status=status.HTTP_404_NOT_FOUND)
        db.delete_player(event_id=event_id, player_id=player_id)
        db.close()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class CheckInView(APIView):
    def post(self, request, event_id, player_id):
        db = eventDB.EventDB()
        data = db.get_player(event_id=event_id, player_id=player_id)
        if data is None:
            return Response({"error": "Участник не найден!"}, status=status.HTTP_404_NOT_FOUND)
        db.check_in(event_id=event_id, player_id=player_id)
        db.close()
        return Response({"message": "Участник успешно отмечен!"}, status=status.HTTP_200_OK)