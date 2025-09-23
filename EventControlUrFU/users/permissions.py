from rest_framework import permissions

class ManagerOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        return (
                request.method in permissions.SAFE_METHODS
                or request.user.is_authenticated
                and (getattr(request.user, 'access_level', None) == 'manager'
                or request.user.is_superuser)
            )

    def has_object_permission(self, request, view, obj):
        # return obj.owner == request.user
        return True