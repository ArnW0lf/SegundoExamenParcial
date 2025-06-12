from django.core.management.base import BaseCommand
from core.models import CustomUser, Subject, Grade, TeacherSubject, StudentEnrollment
from django.contrib.auth.hashers import make_password

class Command(BaseCommand):
    help = 'Configura datos de prueba para la aplicación'

    def handle(self, *args, **kwargs):
        # Crear materias si no existen
        matematicas, _ = Subject.objects.get_or_create(
            name='Matemáticas',
            code='MAT101'
        )
        fisica, _ = Subject.objects.get_or_create(
            name='Física',
            code='FIS101'
        )

        # Crear grados si no existen
        primero_a, _ = Grade.objects.get_or_create(
            name='Primero',
            section='A'
        )
        primero_b, _ = Grade.objects.get_or_create(
            name='Primero',
            section='B'
        )

        # Asignar materias a grados
        matematicas.grades.add(primero_a, primero_b)
        fisica.grades.add(primero_a, primero_b)

        # Buscar al profesor de matemáticas
        profesor = CustomUser.objects.filter(email='profesor.matematicas@escuela.com').first()
        
        if profesor:
            # Asignar materias al profesor
            TeacherSubject.objects.get_or_create(
                teacher=profesor,
                subject=matematicas
            )
            TeacherSubject.objects.get_or_create(
                teacher=profesor,
                subject=fisica
            )
            self.stdout.write(self.style.SUCCESS(f'Materias asignadas al profesor {profesor.email}'))
        else:
            # Crear el profesor si no existe
            profesor = CustomUser.objects.create(
                username='profesor.matematicas',
                email='profesor.matematicas@escuela.com',
                password=make_password('profesor123'),
                first_name='Profesor',
                last_name='Matemáticas',
                role='TEACHER'
            )
            # Asignar materias al profesor
            TeacherSubject.objects.get_or_create(
                teacher=profesor,
                subject=matematicas
            )
            TeacherSubject.objects.get_or_create(
                teacher=profesor,
                subject=fisica
            )
            self.stdout.write(self.style.SUCCESS(f'Profesor creado y materias asignadas'))

        # Crear algunos estudiantes de prueba
        estudiantes = [
            {
                'username': 'estudiante1',
                'email': 'estudiante1@escuela.com',
                'password': 'estudiante123',
                'first_name': 'Estudiante',
                'last_name': 'Uno',
            },
            {
                'username': 'estudiante2',
                'email': 'estudiante2@escuela.com',
                'password': 'estudiante123',
                'first_name': 'Estudiante',
                'last_name': 'Dos',
            }
        ]

        for estudiante_data in estudiantes:
            estudiante, created = CustomUser.objects.get_or_create(
                username=estudiante_data['username'],
                defaults={
                    'email': estudiante_data['email'],
                    'password': make_password(estudiante_data['password']),
                    'first_name': estudiante_data['first_name'],
                    'last_name': estudiante_data['last_name'],
                    'role': 'STUDENT'
                }
            )
            if created:
                # Matricular estudiante en primer grado
                StudentEnrollment.objects.get_or_create(
                    student=estudiante,
                    grade=primero_a,
                    year=2025
                )
                self.stdout.write(self.style.SUCCESS(f'Estudiante {estudiante.email} creado y matriculado'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Estudiante {estudiante.email} ya existe')) 