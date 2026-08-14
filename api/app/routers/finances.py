from fastapi import APIRouter, HTTPException

from app.database import get_connection
from app.models.finance import StudentFinance


router = APIRouter(
    prefix="/finance",
    tags=["Finance"]
)


@router.get(
    "/students/{student_id}",
    response_model=StudentFinance
)
def get_student_finance(student_id: int):

    with get_connection() as conn:
        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    s.student_id,

                    COALESCE(
                        (
                            SELECT SUM(f.amount)
                            FROM finance.fees f
                            WHERE f.level = s.level
                            AND f.academic_year = %s
                        ),
                        0
                    ) AS total_fees,

                    COALESCE(
                        (
                            SELECT SUM(sp.amount_paid)
                            FROM finance.student_payments sp
                            JOIN finance.fees f
                                ON sp.fee_id = f.fee_id
                            WHERE sp.student_id = s.student_id
                            AND f.academic_year = %s
                        ),
                        0
                    ) AS amount_paid

                FROM academic.students s

                WHERE s.student_id = %s
                """,
                (
                    "2025/2026",
                    "2025/2026",
                    student_id
                )
            )

            finance = cursor.fetchone()

    if finance is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    total_fees = finance["total_fees"]
    amount_paid = finance["amount_paid"]

    outstanding_balance = max(
        total_fees - amount_paid,
        0
    )

    return {
        "student_id": student_id,
        "total_fees": total_fees,
        "amount_paid": amount_paid,
        "outstanding_balance": outstanding_balance
    }


@router.get("/students/{student_id}/payments")
def get_student_payments(student_id: int):

    with get_connection() as conn:
        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    sp.payment_id,
                    sp.payment_date,
                    sp.amount_paid,
                    sp.fee_id
                FROM finance.student_payments sp
                WHERE sp.student_id = %s
                ORDER BY sp.payment_date DESC
                """,
                (student_id,)
            )

            payments = cursor.fetchall()

    return {
        "student_id": student_id,
        "payments": payments
    }