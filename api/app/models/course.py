from pydantic import BaseModel


class Course(BaseModel):
    course_id: int
    course_code: str
    course_name: str
    credits: int


class CourseWithSemester(BaseModel):
    course_id: int
    course_code: str
    course_name: str
    credits: int
    semester: int