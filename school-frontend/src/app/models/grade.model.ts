export interface Grade {
  id: number;
  student_id: number;
  student_name?: string;
  subject_id: number;
  subject_name?: string;
  grade_value: number;
  description: string;
  date_recorded: string;
  teacher_id?: number;
  teacher_name?: string;
}

// Interface for grade submission payload if different
export interface GradePayload {
  student_id: number;
  subject_id: number;
  grade_value: number;
  description: string;
}
