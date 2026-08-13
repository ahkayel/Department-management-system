from pydantic import BaseModel


class StudentAcademicInfo(BaseModel):
    student_id: int
    student_number: int
    first_name: str
    last_name: str
    programme: str | None
    level: int | None


class AcademicRecord(BaseModel):
    result_id: int
    course_id: int
    course_code: str
    course_name: str
    credits: int
    semester: int
    academic_year: str
    grade: str | None
    grade_point: float | None


class AcademicRecordResponse(BaseModel):
    student: StudentAcademicInfo
    results: list[AcademicRecord]