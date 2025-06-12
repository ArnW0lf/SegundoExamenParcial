from django.core.management.base import BaseCommand
from core.models import CustomUser, TeacherSubject
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

class Command(BaseCommand):
    help = 'Verifica y corrige los permisos de los usuarios'

    def handle(self, *args, **kwargs):
        # Buscar al profesor
        profesor = CustomUser.objects.filter(email='profesor.matematicas@escuela.com').first()
        
        if not profesor:
            self.stdout.write(self.style.ERROR('Profesor no encontrado'))
            return
            
        self.stdout.write(f"Verificando permisos para: {profesor.email}")
        self.stdout.write(f"Rol actual: {profesor.role}")
        
        # Verificar que el rol sea TEACHER
        if profesor.role != 'TEACHER':
            profesor.role = 'TEACHER'
            profesor.save()
            self.stdout.write(self.style.SUCCESS('Rol actualizado a TEACHER'))
        
        # Verificar asignaciones de materias
        teacher_subjects = TeacherSubject.objects.filter(teacher=profesor)
        self.stdout.write(f"Materias asignadas: {teacher_subjects.count()}")
        for ts in teacher_subjects:
            self.stdout.write(f"- {ts.subject.name}")
        
        # Verificar que el usuario esté activo
        if not profesor.is_active:
            profesor.is_active = True
            profesor.save()
            self.stdout.write(self.style.SUCCESS('Usuario activado'))
        
        self.stdout.write(self.style.SUCCESS('Verificación completada')) 