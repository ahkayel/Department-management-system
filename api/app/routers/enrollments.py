from fastapi import APIRouter, HTTPException

from app.database import get_connection
from app.models.enrollment import EnrollmentRequest


router = APIRouter(
    prefix="/enrollments",
    tags=["Enrollments"]
)


@router.post("/")
def enroll_student(data: EnrollmentRequest):

    try:
        with get_connection() as conn:
            with conn.cursor() as cursor:

                # Check that the course is offered in this semester
                cursor.execute(
                    """
                    SELECT c.course_id
                    FROM academic.courses c

                    INNER JOIN faculty.lecturer_course_assignment lca
                        ON c.course_id = lca.course_id

                    WHERE c.course_id = %s
                      AND lca.academic_year = %s
                      AND lca.semester = %s

                    LIMIT 1
                    """,
                    (
                        data.course_id,
                        data.academic_year,
                        data.semester,
                    )
                )

                course = cursor.fetchone()

                if not course:
                    raise HTTPException(
                        status_code=400,
                        detail="This course is not offered in the selected semester."
                    )

                # Check if already enrolled
                cursor.execute(
                    """
                    SELECT enrollment_id
                    FROM academic.course_enrollment

                    WHERE student_id = %s
                      AND course_id = %s
                      AND semester = %s
                      AND academic_year = %s
                    """,
                    (
                        data.student_id,
                        data.course_id,
                        data.semester,
                        data.academic_year,
                    )
                )

                existing = cursor.fetchone()

                if existing:
                    raise HTTPException(
                        status_code=409,
                        detail="Student is already enrolled in this course."
                    )

                cursor.execute(
                    """
                    INSERT INTO academic.course_enrollment
                    (
                        student_id,
                        course_id,
                        semester,
                        academic_year
                    )
                    VALUES (%s, %s, %s, %s)

                    RETURNING enrollment_id
                    """,
                    (
                        data.student_id,
                        data.course_id,
                        data.semester,
                        data.academic_year,
                    )
                )

                enrollment = cursor.fetchone()

            conn.commit()

        return {
            "success": True,
            "message": "Course enrolled successfully.",
            "enrollment_id": enrollment["enrollment_id"],
        }

    except HTTPException:
        raise

    except Exception as error:
        print("Enrollment error:", error)

        error_message = str(error)

        if "Enrollment failed" in error_message:
            raise HTTPException(
                status_code=403,
                detail=error_message
            )

        raise HTTPException(
            status_code=500,
            detail="Unable to enroll student."
        )


@router.get("/{student_id}")
def get_student_enrollments(student_id: int):

    with get_connection() as conn:
        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    ce.enrollment_id,
                    ce.student_id,
                    s.student_number,
                    s.first_name,
                    s.last_name,

                    c.course_id,
                    c.course_code,
                    c.course_name,
                    c.credits,

                    ce.semester,
                    ce.academic_year

                FROM academic.course_enrollment ce

                INNER JOIN academic.students s
                    ON ce.student_id = s.student_id

                INNER JOIN academic.courses c
                    ON ce.course_id = c.course_id

                WHERE ce.student_id = %s

                ORDER BY
                    ce.academic_year,
                    ce.semester,
                    c.course_code
                """,
                (student_id,)
            )

            enrollments = cursor.fetchall()

    return {
        "student_id": student_id,
        "enrollments": enrollments
    }