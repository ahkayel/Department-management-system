
-- ACADEMIC SCHEMA (Students, Courses, Enrollments)

/* STUDENT PERSONAL INFORMATION */
CREATE TABLE academic.students (
    student_id INT PRIMARY KEY,
    student_number SERIAL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    gender VARCHAR(10),
    date_of_birth DATE,
    phone VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    programme VARCHAR(100),
    level INT
);

/* COURSES */
CREATE TABLE academic.courses (
    course_id SERIAL PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    credits INT NOT NULL
);

/* COURSE ENROLLMENT */
CREATE TABLE academic.course_enrollment(
    enrollment_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES academic.students(student_id),
    course_id INT REFERENCES academic.courses(course_id),
    semester INT,
    academic_year VARCHAR(20)
);

/* COURSE GRADES */
CREATE TABLE academic.course_results (
    result_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    semester INT NOT NULL
        CHECK (semester IN (1, 2)),
    academic_year VARCHAR(20) NOT NULL,
    grade VARCHAR(2),
    grade_point NUMERIC(3,2),
    UNIQUE ( student_id, course_id, semester, academic_year ),

    CONSTRAINT fk_course_result_enrollment
        FOREIGN KEY ( student_id, course_id, semester, academic_year )
        REFERENCES academic.course_enrollment ( student_id, course_id, semester, academic_year )
        ON DELETE CASCADE
);

-- FACULTY SCHEMA (Lecturers, TAs, Assignments)

/* LECTURERS */
CREATE TABLE faculty.lecturers (
    lecturer_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    office_location VARCHAR(50)
);

/* TEACHING ASSISTANTS */
CREATE TABLE faculty.teaching_assistants (
    ta_id SERIAL PRIMARY KEY,
    student_id INT UNIQUE REFERENCES academic.students(student_id) ON DELETE SET NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    graduation_year INT,
    programme VARCHAR(100)
);

/* LECTURER TO COURSE ASSIGNMENT */
CREATE TABLE faculty.lecturer_course_assignment (
    assignment_id SERIAL PRIMARY KEY,
    lecturer_id INT REFERENCES faculty.lecturers(lecturer_id) ,
    course_id INT REFERENCES academic.courses(course_id) ,
    academic_year VARCHAR(20),
    semester INT CHECK (semester IN (1, 2))
);

/* LECTURER TO TA ASSIGNMENT */
CREATE TABLE faculty.ta_assignment (
    ta_assignment_id SERIAL PRIMARY KEY,
    lecturer_id INT REFERENCES faculty.lecturers(lecturer_id),
    ta_id INT REFERENCES faculty.teaching_assistants(ta_id),
    course_id INT REFERENCES academic.courses(course_id),
    academic_year VARCHAR(20),
    semester INT CHECK (semester IN (1, 2))
);

-- FINANCE SCHEMA (Fees & Payments)

/* FEES */
CREATE TABLE finance.fees (
    fee_id SERIAL PRIMARY KEY,
    academic_year VARCHAR(20) NOT NULL,
    semester INT CHECK (semester IN (1, 2)),
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    description VARCHAR(100)
);

/* FEES PAYMENTS */
CREATE TABLE finance.student_payments (
    payment_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES academic.students(student_id),
    fee_id INT REFERENCES finance.fees(fee_id) ON DELETE NO ACTION,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount_paid NUMERIC(10,2) NOT NULL CHECK (amount_paid > 0)
);

-- AUTH SCHEMA (User Authentication & Authorization)
CREATE TABLE auth.student_accounts (
    student_id INTEGER PRIMARY KEY,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_student_account
        FOREIGN KEY (student_id)
        REFERENCES academic.students(student_id)
        ON DELETE CASCADE
);