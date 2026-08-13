from fastapi import APIRouter, HTTPException

from app.database import get_connection
from app.models.academic_record import AcademicRecordResponse


router = APIRouter(
    prefix="/academic_records",
    tags=["Academic Records"]
)


@router.get(
    "/{student_id}",
    response_model=AcademicRecordResponse
)
def get_academic_record(student_id: int):

    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:

                # Get student information
                cursor.execute(
                    """
                    SELECT
                        student_id,
                        student_number,
                        first_name,
                        last_name,
                        programme,
                        level
                    FROM academic.students
                    WHERE student_id = %s
                    """,
                    (student_id,)
                )

                student = cursor.fetchone()

                if not student:
                    raise HTTPException(
                        status_code=404,
                        detail="Student not found."
                    )

                # Get academic results
                cursor.execute(
                    """
                    SELECT
                        cr.result_id,
                        cr.course_id,
                        c.course_code,
                        c.course_name,
                        c.credits,
                        cr.semester,
                        cr.academic_year,
                        cr.grade,
                        cr.grade_point
                    FROM academic.course_results cr

                    INNER JOIN academic.courses c
                        ON cr.course_id = c.course_id

                    WHERE cr.student_id = %s

                    ORDER BY
                        cr.academic_year,
                        cr.semester,
                        c.course_code
                    """,
                    (student_id,)
                )

                results = cursor.fetchall()

        return {
            "student": student,
            "results": results
        }

    except HTTPException:
        raise

    except Exception as error:
        print("Academic record error:", error)

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve academic record."
        )