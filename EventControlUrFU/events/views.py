from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
import events.eventDB.eventDB as eventDB
import events.eventDB.rawJSON as eventJSON
import json
from rest_framework.permissions import AllowAny, IsAuthenticated

import qrcode
from io import BytesIO
from django.http import HttpResponse


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
    
    def patch(self, request, pk):
        serializer = EventSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        db = eventDB.EventDB()
        db.change_event(event_id=pk, event_info=data)
        db.close()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
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
                serializer = PlayerSerializer(instance=sliced_data, many=True) # лол, тут почему-то стоял EventSerializer
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
        role_id = data.get('role_id', None)
        if role_id is None:
            player_id = db.new_player(pk, data['first_name'], data['last_name'], data['group_name'])
        else:
            player_id = db.new_player(pk, data['first_name'], data['last_name'], data['group_name'], role_id)
        db.close()
        ser_data = serializer.data
        ser_data["id"] = player_id
        return Response(ser_data, status=status.HTTP_201_CREATED)
    
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
    
    # # реализовать обновление данных
    # def patch(self, request, event_id, player_id):
    #     serializer = RoleIDSErializer(data=request.data)
    #     if not serializer.is_valid():
    #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #     data = serializer.validated_data
    #     db = eventDB.EventDB()
    #     db.assign_role(event_id=event_id, player_id=player_id, role_id=data['role_id'])
    #     db.close()
    #     return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request, event_id, player_id):
        serializer = PlayerSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        db = eventDB.EventDB()
        db.change_player(event_id=event_id, player_id=player_id, player_info=data)
        db.close()
        return Response(serializer.data, status=status.HTTP_200_OK)

class CheckInView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, event_id, player_id):
        db = eventDB.EventDB()
        data = db.get_player(event_id=event_id, player_id=player_id)
        if data is None:
            return Response({"error": "Участник не найден!"}, status=status.HTTP_404_NOT_FOUND)
        db.check_in(event_id=event_id, player_id=player_id)
        db.close()
        return Response({"message": "Участник успешно отмечен!", "id": player_id}, status=status.HTTP_200_OK)

# NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW NEW
class EventsJSONView(APIView):
    def post(self, request):
        raw_json_str = request.body.decode('utf-8')
        try:
            event_id = eventJSON.new_event(JSON=raw_json_str)
        except:
            return Response({"error": "Invalid JSON, увы"}, status=status.HTTP_400_BAD_REQUEST)
        db = eventDB.EventDB()
        created_event = db.get_event(event_id)
        serializer = EventSerializer(instance=created_event)
        db.close()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        # return Response({"status": "success", "data": {"id": event_id}}, status=status.HTTP_201_CREATED)

class ActivitiesView(APIView):
    def get(self, request, pk):
        db = eventDB.EventDB()
        data = db.get_activities(pk)
        db.close()
        serializer = ActivitySerializer(instance=data, many=True)
        if len(data) <= 0:
            return Response({"error": "Активности отсутствуют или в них ошибка!"})
        try:
            import json
            range_param = request.GET.get('range')
            if range_param:
                start, end = json.loads(range_param)
                sliced_data = data[start:end+1]
                serializer = ActivitySerializer(instance=sliced_data, many=True)
                content_range = f'items {start}-{end}/{len(data)}'
            else:
                content_range = f'items 0-{len(data)-1}/{len(data)}'
        except Exception:
            # На случай некорректного range
            content_range = f'items 0-{len(data)-1}/{len(data)}'

        ser_data = serializer.data
        for act in ser_data:
            act["act_vars"] = json.loads(act["act_vars"])

        response = Response(ser_data, status=status.HTTP_200_OK)
        response['Content-Range'] = content_range
        response['Access-Control-Expose-Headers'] = 'Content-Range'  # обязательно для CORS!
        return response

    def post(self, request, pk):
        serializer = ActivitySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        db = eventDB.EventDB()
        act_id = db.new_activity(pk, data['name'], json.dumps(data['act_vars']))
        ser_data = serializer.data
        ser_data["id"] = act_id
        db.close()
        return Response(ser_data, status=status.HTTP_201_CREATED)
    
class ActivityView(APIView):
    def get(self, request, event_id, act_id):
        db = eventDB.EventDB()
        data = db.get_activity(event_id=event_id, act_id=act_id)
        db.close()
        serializer = ActivitySerializer(instance=data)
        if data is None:
            return Response({"error": "Активность не найдена!"}, status=status.HTTP_404_NOT_FOUND)
        ser_data = serializer.data
        ser_data["act_vars"] = json.loads(ser_data["act_vars"])
        return Response(ser_data, status=status.HTTP_200_OK)
    
    def delete(self, request, event_id, act_id):
        db = eventDB.EventDB()
        data = db.get_activity(event_id=event_id, act_id=act_id)
        if data is None:
            return Response({"error": "Активность не найдена!"}, status=status.HTTP_404_NOT_FOUND)
        db.delete_activity(event_id=event_id, act_id=act_id)
        db.close()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def patch(self, request, event_id, act_id):
        serializer = ActivitySerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        db = eventDB.EventDB()
        db.change_activity(event_id=event_id, act_id=act_id, act_info=data)
        db.close()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class RolesView(APIView):
    def get(self, request, pk):
        db = eventDB.EventDB()
        data = db.get_roles(pk)
        db.close()
        serializer = RoleSerializer(instance=data, many=True)
        if len(data) <= 0:
            return Response({"error": "Роли отсутствуют или в них ошибка!"})
        try:
            import json
            range_param = request.GET.get('range')
            if range_param:
                start, end = json.loads(range_param)
                sliced_data = data[start:end+1]
                serializer = RoleSerializer(instance=sliced_data, many=True)
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
        serializer = RoleSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        db = eventDB.EventDB()
        activities_values = json.dumps(data['activities_values'])
        role_id = db.new_role(event_id=pk, name=data['name'], act_data=activities_values)
        ser_data = serializer.data
        ser_data['id'] = role_id
        db.close()
        return Response(ser_data, status=status.HTTP_201_CREATED)
    
class RoleView(APIView):
    def get(self, request, event_id, role_id):
        db = eventDB.EventDB()
        data = db.get_role(event_id=event_id, role_id=role_id)
        activities_values = db.get_role_act_vars(event_id=event_id, role_id=role_id)
        db.close()
        serializer = RoleSerializer(instance=data)
        if data is None:
            return Response({"error": "Роль не найдена!"}, status=status.HTTP_404_NOT_FOUND)
        
        for act in activities_values:
            act["act_vars"] = json.loads(act["act_vars"])

        ser_data = serializer.data
        ser_data["activities_values"] = activities_values
        return Response(ser_data, status=status.HTTP_200_OK)
    
    def delete(self, request, event_id, role_id):
        db = eventDB.EventDB()
        data = db.get_role(event_id=event_id, role_id=role_id)
        if data is None:
            return Response({"error": "Роль не найдена!"}, status=status.HTTP_404_NOT_FOUND)
        db.delete_role(event_id=event_id, role_id=role_id)
        db.close()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def patch(self, request, event_id, role_id):
        serializer = RoleSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        db = eventDB.EventDB()
        db.change_role(event_id=event_id, role_id=role_id, role_info=data)
        db.close()
        return Response(serializer.data, status=status.HTTP_200_OK)

class AllPlyaerVarsView(APIView):
    def get(self, request, event_id, player_id):
        db = eventDB.EventDB()
        data = db.get_all_player_vars(event_id=event_id, player_id=player_id)
        db.close()
        serializer = PlayerVarsSerializer(instance=data, many=True)
        if len(data) <= 0:
            return Response({"error": "Роли отсутствуют или в них ошибка!"})
        try:
            import json
            range_param = request.GET.get('range')
            if range_param:
                start, end = json.loads(range_param)
                sliced_data = data[start:end+1]
                serializer = PlayerVarsSerializer(instance=sliced_data, many=True)
                content_range = f'items {start}-{end}/{len(data)}'
            else:
                content_range = f'items 0-{len(data)-1}/{len(data)}'
        except Exception:
            # На случай некорректного range
            content_range = f'items 0-{len(data)-1}/{len(data)}'

        ser_data = serializer.data
        for act in ser_data:
            act["act_vars"] = json.loads(act["act_vars"])

        response = Response(ser_data, status=status.HTTP_200_OK)
        response['Content-Range'] = content_range
        response['Access-Control-Expose-Headers'] = 'Content-Range'  # обязательно для CORS!
        return response

class PlayerVarsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, event_id, player_id, act_id):
        db = eventDB.EventDB()
        data = db.get_player_vars(event_id=event_id, player_id=player_id, act_id=act_id)
        # if data is None:
        #     db.reset_act_vars(event_id=event_id, act_id=act_id, player_id=player_id)
        #     data = db.get_player_vars(event_id=event_id, player_id=player_id, act_id=act_id)
        db.close()
        if data is None:
            return Response({"error": "Переменные не найдены!"}, status=status.HTTP_404_NOT_FOUND)
        data["act_vars"] = json.loads(data["act_vars"])
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, event_id, player_id, act_id):
        serializer = PlayerVarsSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        db = eventDB.EventDB()
        db.set_player_vars(event_id=event_id, player_id=player_id, act_id=act_id, act_vars=json.dumps(data['act_vars']))
        db.close()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class QRCodeView(APIView):
    def get(self, request, event_id, player_id):
        pass

def generate_qr_code(request, event_id, player_id):
    # Создаём QR-код
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=20,
        border=2,
    )
    qr.add_data(f'events/{event_id}/players/{player_id}/check-in/')
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    
    response = HttpResponse(buffer.getvalue(), content_type="image/png")
    response['Content-Disposition'] = 'inline; filename="qr_code.png"'
    return response

# это ужас просто
class UserAccessView(APIView):
    def post(self, request, user_id):
        try:
            target_user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        # изменить: сделать разграничение между менеджерами и супер админами
        if not (request.user.is_staff or request.user.access_level == 'manager'):
            return Response(
                {"error": "Permission denied"}, 
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = AccessLevelSerializer(target_user, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        access_level = data['access_level']
        if access_level in ('manager', 'superadmin', 'volunteer'):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class EventRegistrationView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, pk):
        serializer = PlayerSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        db = eventDB.EventDB()
        player_id = db.new_player(pk, data['first_name'], data['last_name'], data['group_name'])
        db.close()
        ser_data = serializer.data
        ser_data["id"] = player_id
        return Response(ser_data, status=status.HTTP_201_CREATED)