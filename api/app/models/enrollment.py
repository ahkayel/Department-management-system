from pydantic import BaseModel


class EnrollmentRequest(BaseModel):
    student_id: int
    course_id: int
    semester: int
    academic_year: str