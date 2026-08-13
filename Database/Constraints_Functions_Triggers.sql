ALTER TABLE finance.fees
ADD COLUMN level INT;

/* Student email format */
ALTER TABLE academic.students
ADD CONSTRAINT check_student_email
CHECK (email LIKE '%@%.%');

/* Lecturer email format */
ALTER TABLE faculty.lecturers
ADD CONSTRAINT check_lecturer_email
CHECK (email LIKE '%@%.%');

/* Teaching Assistant email format */
ALTER TABLE faculty.teaching_assistants
ADD CONSTRAINT check_ta_email
CHECK (email LIKE '%@%.%');

/* Credits must be positive */
ALTER TABLE academic.courses
ADD CONSTRAINT check_positive_credits
CHECK (credits > 0);

/* Prevent duplicate course enrollment */
ALTER TABLE academic.course_enrollment
ADD CONSTRAINT unique_student_course_term
UNIQUE(student_id, course_id, academic_year, semester);

/* Prevent duplicate lecturer assignment */
ALTER TABLE faculty.lecturer_course_assignment
ADD CONSTRAINT unique_lecturer_course_term
UNIQUE(lecturer_id, course_id, academic_year, semester);

/* Prevent duplicate TA assignment */
ALTER TABLE faculty.ta_assignment
ADD CONSTRAINT unique_ta_assignment
UNIQUE(ta_id, lecturer_id, course_id, academic_year, semester);

ALTER TABLE academic.course_enrollment
ADD CONSTRAINT unique_student_course_semester_year
UNIQUE (
    student_id,
    course_id,
    semester,
    academic_year
);



CREATE OR REPLACE FUNCTION finance.get_total_fees_charged(
    p_student_id INT
)
RETURNS NUMERIC(10,2)
LANGUAGE plpgsql
AS $$
DECLARE
    v_student_level INT;
    v_total_fees NUMERIC(10,2) := 0.00;
BEGIN

    SELECT level
    INTO v_student_level
    FROM academic.students
    WHERE student_id = p_student_id;

    IF NOT FOUND THEN
        RETURN 0.00;
    END IF;

    SELECT COALESCE(SUM(amount), 0.00)
    INTO v_total_fees
    FROM finance.fees
    WHERE level = v_student_level;

    RETURN v_total_fees;

END;
$$;


CREATE OR REPLACE FUNCTION finance.get_total_amount_paid(
    p_student_id INT
)
RETURNS NUMERIC(10,2)
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_paid NUMERIC(10,2) := 0.00;
BEGIN

    SELECT COALESCE(SUM(amount_paid), 0.00)
    INTO v_total_paid
    FROM finance.student_payments
    WHERE student_id = p_student_id;

    RETURN v_total_paid;

END;
$$;


CREATE OR REPLACE FUNCTION finance.get_student_balance(
    p_student_id INT
)
RETURNS NUMERIC(10,2)
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_fees NUMERIC(10,2);
    v_total_paid NUMERIC(10,2);
    v_balance NUMERIC(10,2);
BEGIN

    v_total_fees :=
        finance.get_total_fees_charged(p_student_id);

    v_total_paid :=
        finance.get_total_amount_paid(p_student_id);

    v_balance := v_total_fees - v_total_paid;

    -- Prevent negative balance
    IF v_balance < 0 THEN
        v_balance := 0.00;
    END IF;

    RETURN v_balance;

END;
$$;



CREATE OR REPLACE FUNCTION finance.get_student_semester_balance(
    p_student_id INT,
    p_semester INT
)
RETURNS NUMERIC(10,2)
AS $$
DECLARE
    v_student_level INT;
    v_total_fees NUMERIC(10,2);
    v_total_paid NUMERIC(10,2);
BEGIN

    SELECT level
    INTO v_student_level
    FROM academic.students
    WHERE student_id = p_student_id;

    IF NOT FOUND THEN
        RETURN 0.00;
    END IF;

    -- Fees from Semester 1 up to the semester being checked
    SELECT COALESCE(SUM(amount), 0.00)
    INTO v_total_fees
    FROM finance.fees
    WHERE level = v_student_level
      AND semester <= p_semester;

    -- All payments made during the academic year
    SELECT COALESCE(SUM(sp.amount_paid), 0.00)
    INTO v_total_paid
    FROM finance.student_payments sp
    JOIN finance.fees f
        ON sp.fee_id = f.fee_id
    WHERE sp.student_id = p_student_id;

    RETURN GREATEST(v_total_fees - v_total_paid, 0.00);

END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION finance.get_outstanding_fees_json()
RETURNS JSON
LANGUAGE plpgsql
AS $$
BEGIN

    RETURN (
        SELECT COALESCE(
            json_agg(
                json_build_object(
                    'student_id',
                    s.student_id,

                    'student_number',
                    s.student_number,

                    'name',
                    s.first_name || ' ' || s.last_name,

                    'programme',
                    s.programme,

                    'level',
                    s.level,

                    'total_fees',
                    finance.get_total_fees_charged(s.student_id),

                    'amount_paid',
                    finance.get_total_amount_paid(s.student_id),

                    'outstanding_balance',
                    finance.get_student_balance(s.student_id)
                )
            ),
            '[]'::json
        )
        FROM academic.students s
    );

END;
$$;


CREATE OR REPLACE FUNCTION academic.check_fee_payment_before_enrollment()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_paid NUMERIC(10,2);
    v_required_payment NUMERIC(10,2);
BEGIN

    -- Get the student's total payment for the academic year
    v_total_paid := finance.get_total_amount_paid(NEW.student_id);

    -- Determine the cumulative payment required
    -- for the semester being registered.
    IF NEW.semester = 1 THEN

        v_required_payment := 3500.00;

    ELSIF NEW.semester = 2 THEN

        v_required_payment := 7000.00;

    ELSE

        RAISE EXCEPTION
            'Invalid semester: %',
            NEW.semester;

    END IF;


    -- Check whether the student has paid enough
    -- for the requested semester.
    IF v_total_paid < v_required_payment THEN

        RAISE EXCEPTION
            'Enrollment failed: Student (ID: %) has paid GHS %.2f, but GHS %.2f is required to register for Semester %.',
            NEW.student_id,
            v_total_paid,
            v_required_payment,
            NEW.semester;

    END IF;


    RETURN NEW;

END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_fee_check
ON academic.course_enrollment;

CREATE TRIGGER trg_enforce_fee_check
BEFORE INSERT OR UPDATE
ON academic.course_enrollment
FOR EACH ROW
EXECUTE FUNCTION academic.check_fee_payment_before_enrollment();

CREATE OR REPLACE FUNCTION faculty.verify_lecturer_course_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_assigned_count INT;
BEGIN

    SELECT COUNT(*)
    INTO v_assigned_count
    FROM faculty.lecturer_course_assignment
    WHERE lecturer_id = NEW.lecturer_id
      AND course_id = NEW.course_id
      AND academic_year = NEW.academic_year
      AND semester = NEW.semester;


    IF v_assigned_count = 0 THEN

        RAISE EXCEPTION
            'Invalid TA Assignment: Lecturer (ID: %) is not assigned to teach Course (ID: %) for % Semester %',
            NEW.lecturer_id,
            NEW.course_id,
            NEW.academic_year,
            NEW.semester;

    END IF;


    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS trg_verify_ta_lecturer_course
ON faculty.ta_assignment;

CREATE TRIGGER trg_verify_ta_lecturer_course
BEFORE INSERT OR UPDATE
ON faculty.ta_assignment
FOR EACH ROW
EXECUTE FUNCTION faculty.verify_lecturer_course_assignment();