from fastapi import APIRouter, HTTPException
import bcrypt

from app.database import get_connection
from app.models.auth import LoginRequest, LoginResponse, RegisterRequest, RegisterResponse


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/login",
    response_model=LoginResponse
)
def login_student(data: LoginRequest):

    with get_connection() as conn:
        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    sa.student_id,
                    sa.password_hash,
                    s.student_number,
                    s.first_name,
                    s.last_name
                FROM auth.student_accounts sa

                INNER JOIN academic.students s
                    ON sa.student_id = s.student_id

                WHERE sa.student_id = %s
                """,
                (data.student_id,)
            )

            student = cursor.fetchone()

    if student is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid student ID or password."
        )

    password_hash = student["password_hash"]

    if isinstance(password_hash, memoryview):
        password_hash = password_hash.tobytes()

    elif isinstance(password_hash, str):
        password_hash = password_hash.encode("utf-8")

    if not bcrypt.checkpw(
        data.password.encode("utf-8"),
        password_hash
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid student ID or password."
        )

    return {
        "success": True,
        "message": "Login successful.",
        "student_id": student["student_id"],
        "student_number": student["student_number"],
        "first_name": student["first_name"],
        "last_name": student["last_name"]
    }

@router.post(
    "/register",
    response_model=RegisterResponse
)
def register_student(data: RegisterRequest):

    with get_connection() as conn:
        with conn.cursor() as cursor:

            # Check student exists
            cursor.execute(
                """
                SELECT
                    student_id,
                    email
                FROM academic.students
                WHERE student_id = %s
                """,
                (data.student_id,)
            )

            student = cursor.fetchone()

            if student is None:
                raise HTTPException(
                    status_code=404,
                    detail="Student record not found."
                )

            # Check email
            if not student["email"]:
                raise HTTPException(
                    status_code=400,
                    detail="No email is associated with this student."
                )

            if student["email"].strip().lower() != data.email.strip().lower():
                raise HTTPException(
                    status_code=400,
                    detail="The email does not match the student record."
                )

            # Check existing account
            cursor.execute(
                """
                SELECT student_id
                FROM auth.student_accounts
                WHERE student_id = %s
                """,
                (data.student_id,)
            )

            existing_account = cursor.fetchone()

            if existing_account:
                raise HTTPException(
                    status_code=409,
                    detail="An account already exists for this student."
                )

            # Hash password
            password_hash = bcrypt.hashpw(
                data.password.encode("utf-8"),
                bcrypt.gensalt()
            )

            # Insert account
            cursor.execute(
                """
                INSERT INTO auth.student_accounts
                    (student_id, password_hash)
                VALUES
                    (%s, %s)
                """,
                (
                    data.student_id,
                    password_hash
                )
            )

        conn.commit()

    return {
        "success": True,
        "message": "Registration successful.",
        "student_id": data.student_id
    }