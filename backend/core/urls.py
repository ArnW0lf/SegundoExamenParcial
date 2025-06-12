from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, GradeViewSet, SubjectViewSet, TeacherSubjectViewSet,
    StudentEnrollmentViewSet, GradeRecordViewSet, AttendanceViewSet,
    ParticipationRecordViewSet, AcademicPredictionViewSet,
    DashboardView, StudentDetailDashboardView
)
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='general-users')
router.register(r'students', UserViewSet, basename='student-users')
router.register(r'teachers', UserViewSet, basename='teacher-users')
router.register(r'grades', GradeViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'teacher-subjects', TeacherSubjectViewSet)
router.register(r'enrollments', StudentEnrollmentViewSet)
router.register(r'grade-records', GradeRecordViewSet, basename='grade-records')
router.register(r'attendance', AttendanceViewSet, basename='attendance')
router.register(r'participation', ParticipationRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserViewSet.as_view({'post': 'create'}), name='register'),
    path('login/', obtain_auth_token, name='login'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('student-dashboard/<int:student_id>/', StudentDetailDashboardView.as_view(), name='student-dashboard'),
    
    # Rutas específicas para profesores
    path('teachers/my-subjects/', UserViewSet.as_view({'get': 'my_subjects'}), name='teacher-subjects'),
    path('teachers/my-students/', UserViewSet.as_view({'get': 'my_students'}), name='teacher-students'),
    
    # Rutas específicas para predicciones - Primero las rutas especiales
    path('predictions/stats/', AcademicPredictionViewSet.as_view({'get': 'stats'}), name='prediction-stats'),
    path('predictions/performance-comparison/', AcademicPredictionViewSet.as_view({'get': 'performance_comparison'}), name='prediction-performance'),
    
    # Rutas CRUD básicas para predicciones
    path('predictions/', AcademicPredictionViewSet.as_view({'get': 'list', 'post': 'create'}), name='prediction-list'),
    path('predictions/<int:pk>/', AcademicPredictionViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy'
    }), name='prediction-detail'),
    
    path('api-auth/', include('rest_framework.urls')),
]