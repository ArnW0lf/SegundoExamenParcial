from django.core.management.base import BaseCommand
from core.models import CustomUser
from rest_framework.authtoken.models import Token
from django.utils import timezone
from datetime import timedelta

class Command(BaseCommand):
    help = 'Verifica y regenera el token de autenticación'

    def handle(self, *args, **kwargs):
        # Buscar al profesor
        profesor = CustomUser.objects.filter(email='profesor.matematicas@escuela.com').first()
        
        if not profesor:
            self.stdout.write(self.style.ERROR('Profesor no encontrado'))
            return
            
        self.stdout.write(f"Verificando token para: {profesor.email}")
        
        # Eliminar token existente si hay
        Token.objects.filter(user=profesor).delete()
        
        # Crear nuevo token
        token = Token.objects.create(user=profesor)
        
        self.stdout.write("Información del usuario:")
        self.stdout.write(f"ID: {profesor.id}")
        self.stdout.write(f"Username: {profesor.username}")
        self.stdout.write(f"Email: {profesor.email}")
        self.stdout.write(f"Rol: {profesor.role}")
        self.stdout.write(f"Activo: {profesor.is_active}")
        self.stdout.write(f"Nuevo token: {token.key}")
        
        self.stdout.write(self.style.SUCCESS('Token regenerado correctamente')) 