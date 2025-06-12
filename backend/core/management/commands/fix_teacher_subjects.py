from django.core.management.base import BaseCommand
from core.models import CustomUser, TeacherSubject, Subject
from django.db import transaction

class Command(BaseCommand):
    help = 'Corrige las asignaciones duplicadas de materias a profesores'

    def handle(self, *args, **kwargs):
        # Buscar al profesor
        profesor = CustomUser.objects.filter(email='profesor.matematicas@escuela.com').first()
        
        if not profesor:
            self.stdout.write(self.style.ERROR('Profesor no encontrado'))
            return
            
        self.stdout.write(f"Corrigiendo asignaciones para: {profesor.email}")
        
        # Eliminar todas las asignaciones actuales
        TeacherSubject.objects.filter(teacher=profesor).delete()
        
        # Obtener las materias
        matematicas = Subject.objects.get(code='MAT101')
        fisica = Subject.objects.get(code='FIS101')
        
        # Crear nuevas asignaciones únicas
        with transaction.atomic():
            TeacherSubject.objects.create(teacher=profesor, subject=matematicas)
            TeacherSubject.objects.create(teacher=profesor, subject=fisica)
        
        # Verificar las asignaciones
        teacher_subjects = TeacherSubject.objects.filter(teacher=profesor)
        self.stdout.write("Materias asignadas:")
        for ts in teacher_subjects:
            self.stdout.write(f"- {ts.subject.name} (código: {ts.subject.code})")
        
        self.stdout.write(self.style.SUCCESS('Asignaciones corregidas correctamente')) 