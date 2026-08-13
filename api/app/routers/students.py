from fastapi import APIRouter
from app.database import get_connection
from app.models.student import Student
from fastapi import APIRouter, HTTPException

router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


@router.get("/", response_model=list[Student])
def get_students():

    with get_connection() as conn:
        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    student_id,
                    student_number,
                    first_name,
                    last_name,
                    gender,
                    date_of_birth,
                    phone,
                    email,
                    programme,
                    level
                FROM academic.students
                ORDER BY student_number
                """
            )

            students = cursor.fetchall()

    return students

@router.get("/{student_id}", response_model=Student)
def get_student(student_id: int):

    with get_connection() as conn:
        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    student_id,
                    student_number,
                    first_name,
                    last_name,
                    gender,
                    date_of_birth,
                    phone,
                    email,
                    programme,
                    level
                FROM academic.students
                WHERE student_id = %s
                """,
                (student_id,)
            )

            student = cursor.fetchone()

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return student