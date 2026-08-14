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

                cursor.execute(
                    """
                    SELECT DISTINCT ON (
                        ce.course_id
                    )
                        ce.course_id,
                        c.course_code,
                        c.course_name,
                        c.credits,

                        ce.semester,
                        ce.academic_year,

                        cr.result_id,
                        cr.grade,
                        cr.grade_point

                    FROM academic.course_enrollment ce

                    INNER JOIN academic.courses c
                        ON ce.course_id = c.course_id

                    LEFT JOIN academic.course_results cr
                        ON cr.student_id = ce.student_id
                        AND cr.course_id = ce.course_id
                        AND cr.semester = ce.semester
                        AND cr.academic_year = ce.academic_year

                    WHERE ce.student_id = %s

                    ORDER BY
                        ce.course_id,
                        ce.academic_year DESC,
                        ce.semester DESC
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