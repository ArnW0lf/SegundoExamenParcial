from rest_framework.permissions import BasePermission
from .models import TeacherSubject, Subject

class IsTeacherUser(BasePermission):
    """
    Permiso personalizado para permitir solo a usuarios con rol de profesor.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'TEACHER'

class IsAdminOrTeacherOfSubjectObject(BasePermission):
    """
    Permiso personalizado para permitir acceso solo a administradores o profesores
    que enseñan la materia relacionada con el objeto.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        if request.user.role == 'TEACHER':
            return obj.subject in Subject.objects.filter(teachersubject__teacher=request.user)
        return False

class IsAdminOrTeacherOfSubjectObjectAttendance(BasePermission):
    """
    Permiso personalizado para permitir acceso solo a administradores o profesores
    que enseñan la materia relacionada con la asistencia.
    """
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        if request.user.role == 'TEACHER':
            return obj.subject in Subject.objects.filter(teachersubject__teacher=request.user)
        return False
