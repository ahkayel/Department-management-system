from pydantic import BaseModel
from datetime import date


class Student(BaseModel):
    student_id: int
    student_number: int
    first_name: str
    last_name: str
    gender: str | None
    date_of_birth: date | None
    phone: str | None
    email: str | None
    programme: str | None
    level: int | None