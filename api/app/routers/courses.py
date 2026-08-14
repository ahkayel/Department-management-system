from fastapi import APIRouter, HTTPException, Query

from app.database import get_connection
from app.models.course import Course, CourseWithSemester


router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)


@router.get("/", response_model=list[CourseWithSemester])
def get_courses(
    semester: int = Query(..., ge=1, le=2)
):

    with get_connection() as conn:
        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    c.course_id,
                    c.course_code,
                    c.course_name,
                    c.credits,
                    lca.semester
                FROM academic.courses c
                INNER JOIN faculty.lecturer_course_assignment lca
                    ON c.course_id = lca.course_id
                WHERE lca.academic_year = %s
                    AND lca.semester = %s
                ORDER BY c.course_code
                """,
                ("2025/2026", semester)
            )

            courses = cursor.fetchall()

    return courses


@router.get("/{course_id}", response_model=CourseWithSemester)
def get_course(course_id: int):

    with get_connection() as conn:
        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    c.course_id,
                    c.course_code,
                    c.course_name,
                    c.credits,
                    lca.semester
                FROM academic.courses c
                INNER JOIN faculty.lecturer_course_assignment lca
                    ON c.course_id = lca.course_id
                WHERE c.course_id = %s
                    AND lca.academic_year = %s
                LIMIT 1
                """,
                (course_id, "2025/2026")
            )

            course = cursor.fetchone()

    if course is None:
        raise HTTPException(
            status_code=404,
            detail="Course not found"
        )

    return course

