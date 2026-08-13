from pydantic import BaseModel
from decimal import Decimal


class StudentFinance(BaseModel):
    student_id: int
    total_fees: Decimal
    amount_paid: Decimal
    outstanding_balance: Decimal