from pydantic import BaseModel


class LoginRequest(BaseModel):
    student_id: int
    password: str


class LoginResponse(BaseModel):
    success: bool
    message: str
    student_id: int
    student_number: int
    first_name: str
    last_name: str


class RegisterRequest(BaseModel):
    student_id: int
    email: str
    password: str


class RegisterResponse(BaseModel):
    success: bool
    message: str
    student_id: int