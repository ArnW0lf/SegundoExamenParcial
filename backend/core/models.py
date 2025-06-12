from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType

class CustomUser(AbstractUser):
    ROLES = (
        ('ADMIN', 'Administrador'),
        ('TEACHER', 'Docente'),
        ('STUDENT', 'Alumno'),
        ('PARENT', 'Padre'),
    )
    role = models.CharField(max_length=10, choices=ROLES)
    dni = models.CharField(max_length=20, unique=True, null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    children = models.ManyToManyField('self', blank=True, limit_choices_to={'role': 'STUDENT'}, symmetrical=False)
    specialty = models.CharField(max_length=100, null=True, blank=True) # Field for teacher's specialty

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Grade(models.Model):  # Representa un grado escolar
    name = models.CharField(max_length=50)
    section = models.CharField(max_length=1)
    
    class Meta:
        unique_together = ('name', 'section')
    
    def __str__(self):
        return f"{self.name} {self.section}"
    
class Subject(models.Model): # Representa una materia
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    grades = models.ManyToManyField(Grade, related_name='subjects')
    
    def __str__(self):
        return self.name

class TeacherSubject(models.Model): # Relaciona un docente con una materia
    teacher = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'TEACHER'}, related_name='teacher_subjects')
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE, related_name='teacher_subjects')
    
    class Meta:
        unique_together = ('teacher', 'subject')
        verbose_name = 'Asignación de Materia a Profesor'
        verbose_name_plural = 'Asignaciones de Materias a Profesores'
    
    def clean(self):
        if self.teacher.role != 'TEACHER':
            raise ValidationError('Solo los profesores pueden ser asignados a materias.')
    
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.teacher.get_full_name()} - {self.subject.name}"

class StudentEnrollment(models.Model): # Relaciona un alumno con un grado escolar
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'STUDENT'})
    grade = models.ForeignKey(Grade, on_delete=models.CASCADE)
    year = models.PositiveIntegerField()
    
    class Meta:
        unique_together = ('student', 'year')
    
    def __str__(self):
        return f"{self.student} - {self.grade} ({self.year})"

class GradeRecord(models.Model): # Representa una calificación de un alumno en una materia
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'STUDENT'})
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    exam_type = models.CharField(max_length=50)
    grade = models.DecimalField(max_digits=5, decimal_places=2)
    date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.student} - {self.subject}: {self.grade}"

class Attendance(models.Model): # Representa la asistencia de un alumno a una clase
    STATUS_CHOICES = (
        ('P', 'Presente'),
        ('A', 'Ausente'),
        ('J', 'Justificado'),
    )
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'STUDENT'})
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=1, choices=STATUS_CHOICES)
    notes = models.TextField(blank=True)
    
    class Meta: # Relaciona un alumno con una materia y una fecha
        unique_together = ('student', 'subject', 'date')
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.student.username} - {self.subject.name} ({self.date}): {self.get_status_display()}"

class ParentPermissions:
    @classmethod
    def create(cls):
        content_type = ContentType.objects.get_for_model(CustomUser)
        
        Permission.objects.get_or_create(
            codename='view_child_grades',
            name='Can view child grades',
            content_type=content_type
        )
        
        Permission.objects.get_or_create(
            codename='view_child_attendance',
            name='Can view child attendance',
            content_type=content_type
        )

class AcademicPrediction(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='predictions')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='predictions')
    predicted_grade = models.DecimalField(max_digits=4, decimal_places=2)
    confidence_score = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['student', 'subject']
        ordering = ['-created_at']

    def __str__(self):
        return f"Predicción para {self.student.username} en {self.subject.name}"

class ParticipationRecord(models.Model):
    PARTICIPATION_TYPES = (
        ('QUESTION', 'Pregunta'),
        ('ANSWER', 'Respuesta'),
        ('DISCUSSION', 'Participación en Discusión'),
        ('PRESENTATION', 'Presentación'),
        ('GROUP_WORK', 'Trabajo en Grupo'),
    )
    
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={'role': 'STUDENT'})
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    participation_type = models.CharField(max_length=20, choices=PARTICIPATION_TYPES)
    description = models.TextField(blank=True)
    quality_score = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # Escala 1-5
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.student} - {self.subject} - {self.get_participation_type_display()} ({self.date})"

# Create your models here.