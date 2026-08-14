from fastapi import FastAPI

from app.routers.students import router as students_router
from app.routers.courses import router as courses_router
from app.routers.finances import router as finances_router
from app.routers.enrollments import router as enrollments_router
from app.routers.academic_records import router as academic_records_router
from app.routers.auth import router as auth_router

app = FastAPI(
    title="Department Management System API",
    description="Web API for the Department Management System",
    version="1.0.0",
)


@app.get("/")
def root():
    return {
        "message": "Department Management System API is running"
    }


app.include_router(students_router)
app.include_router(courses_router)
app.include_router(finances_router)
app.include_router(enrollments_router)
app.include_router(academic_records_router)
app.include_router(auth_router)