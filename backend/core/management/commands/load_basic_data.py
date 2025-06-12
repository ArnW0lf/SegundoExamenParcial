from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from core.models import CustomUser, Grade, Subject, StudentEnrollment, TeacherSubject
from datetime import date

class Command(BaseCommand):
    help = 'Carga datos básicos para el sistema'

    def handle(self, *args, **kwargs):
        self.stdout.write('Cargando datos básicos...')

        # Limpiar datos existentes
        Grade.objects.all().delete()
        Subject.objects.all().delete()
        TeacherSubject.objects.all().delete()
        StudentEnrollment.objects.all().delete()
        # No eliminamos usuarios para mantener la integridad

        # Crear usuario administrador si no existe
        admin_email = "admin@escuela.com"
        if not CustomUser.objects.filter(email=admin_email).exists():
            admin_user = CustomUser.objects.create(
                username=admin_email,
                email=admin_email,
                password=make_password("admin123"),
                first_name="Administrador",
                last_name="Sistema",
                role="ADMIN",
                is_staff=True,
                is_superuser=True
            )
            self.stdout.write(self.style.SUCCESS('Usuario administrador creado'))
        else:
            self.stdout.write(self.style.SUCCESS('Usuario administrador ya existe'))

        # Crear grados
        grados = [
            "Primer Grado",
            "Segundo Grado",
            "Tercer Grado",
            "Cuarto Grado",
            "Quinto Grado"
        ]
        
        grade_objects = []
        for grado in grados:
            grade = Grade.objects.create(
                name=grado
            )
            grade_objects.append(grade)
        self.stdout.write(self.style.SUCCESS('Grados creados'))

        # Crear materias
        materias = [
            {"name": "Matemáticas", "code": "MAT001"},
            {"name": "Comunicación", "code": "COM001"},
            {"name": "Ciencias Sociales", "code": "SOC001"},
            {"name": "Ciencias Naturales", "code": "NAT001"},
            {"name": "Inglés", "code": "ING001"},
            {"name": "Educación Física", "code": "EDF001"}
        ]
        
        for materia in materias:
            if not Subject.objects.filter(code=materia["code"]).exists():
                subject = Subject.objects.create(
                    name=materia["name"],
                    code=materia["code"]
                )
                # Asignar la materia a todos los grados
                subject.grades.set(grade_objects)
                self.stdout.write(self.style.SUCCESS(f'Materia {materia["name"]} creada'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Materia {materia["name"]} ya existe'))

        # Crear algunos profesores
        profesores = [
            {
                "email": "profesor.matematicas@escuela.com",
                "first_name": "Juan",
                "last_name": "Pérez",
                "dni": "12345678",
                "specialization": "Matemáticas"
            },
            {
                "email": "profesor.comunicacion@escuela.com",
                "first_name": "María",
                "last_name": "García",
                "dni": "87654321",
                "specialization": "Comunicación"
            }
        ]

        for profesor in profesores:
            if not CustomUser.objects.filter(email=profesor["email"]).exists():
                teacher = CustomUser.objects.create(
                    username=profesor["email"],
                    email=profesor["email"],
                    password=make_password("profesor123"),
                    first_name=profesor["first_name"],
                    last_name=profesor["last_name"],
                    role="TEACHER",
                    dni=profesor["dni"],
                    birth_date=date(1980, 1, 1)
                )
                # Asignar materias a los profesores
                subject = Subject.objects.filter(name=profesor["specialization"]).first()
                if subject:
                    TeacherSubject.objects.create(teacher=teacher, subject=subject)
                self.stdout.write(self.style.SUCCESS(f'Profesor {profesor["email"]} creado'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Profesor {profesor["email"]} ya existe'))

        # Crear algunos estudiantes
        estudiantes = [
            {
                "email": "estudiante1@escuela.com",
                "first_name": "Pedro",
                "last_name": "Martínez",
                "dni": "11111111"
            },
            {
                "email": "estudiante2@escuela.com",
                "first_name": "Ana",
                "last_name": "López",
                "dni": "22222222"
            }
        ]

        for estudiante in estudiantes:
            if not CustomUser.objects.filter(email=estudiante["email"]).exists():
                student = CustomUser.objects.create(
                    username=estudiante["email"],
                    email=estudiante["email"],
                    password=make_password("estudiante123"),
                    first_name=estudiante["first_name"],
                    last_name=estudiante["last_name"],
                    role="STUDENT",
                    dni=estudiante["dni"],
                    birth_date=date(2005, 1, 1)
                )
                # Asignar estudiante a un grado
                StudentEnrollment.objects.create(
                    student=student,
                    grade=Grade.objects.first(),  # Asignar al primer grado
                    year=2024
                )
                self.stdout.write(self.style.SUCCESS(f'Estudiante {estudiante["email"]} creado'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Estudiante {estudiante["email"]} ya existe'))

        self.stdout.write(self.style.SUCCESS('Todos los datos básicos han sido cargados exitosamente')) 