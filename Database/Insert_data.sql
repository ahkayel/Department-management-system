TRUNCATE TABLE academic.course_enrollment, 
               faculty.ta_assignment, 
               faculty.lecturer_course_assignment, 
               finance.student_payments, 
               finance.fees, 
               faculty.teaching_assistants, 
               faculty.lecturers, 
               academic.courses, 
               academic.students RESTART IDENTITY CASCADE;

-- COURSES
INSERT INTO academic.courses (course_code, course_name, credits) VALUES
('SENG 202', 'Differential Equations', 4),
('CPEN 204', 'Data Structures and Algorithms', 3),
('CPEN 206', 'Linear Circuits', 3),
('CPEN 208', 'Software Engineering', 3),
('CPEN 212', 'Data Communications', 3);

-- FEES
INSERT INTO finance.fees (academic_year, semester, amount, description, level) VALUES
('2025/2026', 1, 3500.00, 'Level 200 Academic Fees - Semester 1', 200),
('2025/2026', 2, 3500.00, 'Level 200 Academic Fees - Semester 2', 200);

-- LECTURERS
INSERT INTO faculty.lecturers (first_name, last_name, email, phone, office_location) VALUES
('Godfrey', 'Mills', 'gmills@ug.edu.gh', '0244100001', 'CPEN Office 01'),
('Percy', 'Okae', 'pokae@ug.edu.gh', '0244100002', 'CPEN Office 02'),
('Wiafe', 'Owusu-Banahene', 'wobanahene@ug.edu.gh', '0244100003', 'CPEN Office 03'),
('Isaac', 'Aboagye', 'iaboagye@ug.edu.gh', '0244100004', 'CPEN Office 04');

-- TEACHING ASSISTANTS
INSERT INTO faculty.teaching_assistants (first_name, last_name, email, phone, graduation_year, programme) VALUES
('Isaac', 'Kobi', 'ikobi001@st.ug.edu.gh', '0200100001', 2025, 'BSc. Computer Engineering'),
('Ebenezer', 'Aidoo', 'eaidoo002@st.ug.edu.gh', '0200100002', 2025, 'BSc. Computer Engineering'),
('Salam', 'Hakeem', 'adacosta003@st.ug.edu.gh', '0200100003', 2025, 'BSc. Computer Engineering');

-- STUDENTS
INSERT INTO academic.students
(student_id, student_number, first_name, last_name, gender, date_of_birth, phone, email, programme, level) VALUES
(22384451, 1, 'Golda', 'Abu Neaquittae', 'Female', '2004-03-12', '0240100001', 'gnabu@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22357814, 2, 'Stephen Yaw', 'Adzasa', 'Male', '2003-11-20', '0240100002', 'syadzasa@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22375367, 3, 'Afia Beaa', 'Osei-Safo', 'Female', '2004-01-15', '0240100003', 'abosei-safo@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22397756, 4, 'Ryan', 'Agbemavi', 'Male', '2003-08-05', '0240100004', 'ragbemavi@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22369321, 5, 'Nathaniel Tetteh', 'Agormeda', 'Male', '2004-05-19', '0240100005', 'ntagormeda@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22301848, 6, 'Ahmad Mohammed Sahih', 'Kayelgu', 'Male', '2003-09-30', '0240100006', 'amskayelgu@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22339520, 7, 'Yaa Obeng', 'Amprofi', 'Female', '2004-02-14', '0240100007', 'yoamprofi@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22333597, 8, 'Esme Lilian', 'Asante', 'Female', '2004-06-25', '0240100008', 'elasante@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22268986, 9, 'Gabriel Kwaku', 'Asante', 'Male', '2003-12-10', '0240100009', 'gkasante@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22381577, 10, 'Daniel', 'Botchway', 'Male', '2004-04-18', '0240100010', 'dbotchway@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22315830, 11, 'Brian', 'Assibey-Yeboah', 'Male', '2003-07-22', '0240100011', 'bassibey-yeboah@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22388189, 12, 'Caleb', 'Mensah', 'Male', '2004-10-11', '0240100012', 'cmensah@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22393520, 13, 'Cyril Desmond', 'Ofori', 'Male', '2003-05-09', '0240100013', 'cdofori@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22312110, 14, 'David Kwame', 'Odoi-Anim', 'Male', '2004-08-14', '0240100014', 'dkodoi-anim@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22300896, 15, 'Collins Kweku', 'Doe', 'Male', '2003-03-29', '0240100015', 'ckdoe@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22397491, 16, 'Douglas Kwaw', 'Adjei', 'Male', '2004-09-03', '0240100016', 'dkadjei@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22387715, 17, 'Dzidzor Apu', 'Apawudza', 'Female', '2004-01-27', '0240100017', 'daapawudza@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22382302, 18, 'Edward Kakra', 'Ankrah', 'Male', '2003-10-15', '0240100018', 'ekankrah@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22379061, 19, 'Emmanuel Akotuah', 'Osae', 'Male', '2004-06-08', '0240100019', 'eaosae@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22368809, 20, 'Emmanuel', 'Dery', 'Male', '2003-04-12', '0240100020', 'edery@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22370498, 21, 'Ethan Edric Kweku', 'Nartey', 'Male', '2004-11-01', '0240100021', 'eeknartey@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22382425, 22, 'Gilbert Akwasi Sarkodie', 'Yeboah', 'Male', '2003-02-17', '0240100022', 'gasyeboah@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22396551, 23, 'Jerrold Xornam', 'Kyekye', 'Male', '2004-07-20', '0240100023', 'jxkyekye@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22398562, 24, 'Joseph', 'Amankwah', 'Male', '2003-08-31', '0240100024', 'jamankwah@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22398596, 25, 'Joshua', 'Appiah', 'Male', '2004-03-24', '0240100025', 'jappiah@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22385323, 26, 'Jude Gyampoh', 'Addo', 'Male', '2003-09-05', '0240100026', 'jgaddo@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22303421, 27, 'Winambe Tetteh-Kumah', 'Kemausuor', 'Male', '2004-05-13', '0240100027', 'wtkemausuor@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22407033, 28, 'Kenzi', 'Segbefia', 'Male', '2003-12-04', '0240100028', 'ksegbefia@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22299189, 29, 'David', 'Kessey Ntiako', 'Male', '2004-01-09', '0240100029', 'dkessey@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22407837, 30, 'Kingsley Caldicock', 'Quartey', 'Male', '2003-06-28', '0240100030', 'kcquartey@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22412615, 31, 'Kofi Boateng', 'Oware-Tano', 'Male', '2004-04-02', '0240100031', 'kboware-tano@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22411009, 32, 'Kwaku Aninkorah', 'Barimah', 'Male', '2003-10-23', '0240100032', 'kabarimah@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22382547, 33, 'Kwame Ayeh', 'Obeng', 'Male', '2004-02-18', '0240100033', 'kaobeng@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22373317, 34, 'Kwamena Kesse', 'Quaicoe', 'Male', '2003-07-07', '0240100034', 'kkquaicoe@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22339058, 35, 'Maame Abena Amihere', 'Ahu', 'Female', '2004-08-30', '0240100035', 'maahu@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22302628, 36, 'Maame Araba', 'Grant-Aidoo', 'Female', '2003-11-14', '0240100036', 'magrant-aidoo@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22396566, 37, 'Kelvin Oppong', 'Manford', 'Male', '2004-03-01', '0240100037', 'komanford@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22325819, 38, 'Nana Adwoa Dansowaah', 'Odoom', 'Female', '2003-05-21', '0240100038', 'nadodoom@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22344703, 39, 'Nana', 'Anokye', 'Male', '2004-12-16', '0240100039', 'nanokye@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22306910, 40, 'Newlove Yeboaah', 'Kwarfo', 'Male', '2003-01-08', '0240100040', 'nykwarfo@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22385472, 41, 'Ernest Antwi', 'Obeng', 'Male', '2004-09-25', '0240100041', 'eaobeng@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22399214, 42, 'Ruth', 'Obeng', 'Female', '2003-04-06', '0240100042', 'robeng@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22263126, 43, 'Yaw Poku', 'Owusu Koranteng', 'Male', '2004-10-30', '0240100043', 'ypowusu@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22373463, 44, 'Nana Boadiwaa', 'Owusu', 'Female', '2003-02-12', '0240100044', 'nbowusu@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22381702, 45, 'Paula Akosua Asiedua', 'Frimpong', 'Female', '2004-07-04', '0240100045', 'pafrimpong@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22387846, 46, 'Emile', 'Quaicoo', 'Male', '2003-08-19', '0240100046', 'equaicoo@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22263922, 47, 'Romel Alvin Nii Lartey', 'Lartey', 'Male', '2004-06-11', '0240100047', 'ranlartey@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22401641, 48, 'Sandra Naa Adaku', 'Mettle', 'Female', '2003-12-27', '0240100048', 'snamettle@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22403781, 49, 'Kofi Bempong', 'Sekyere', 'Male', '2004-01-22', '0240100049', 'kbsekyere@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22304260, 50, 'Christian Edward Nii Mantey', 'Tetteh', 'Male', '2003-05-15', '0240100050', 'cenmtetteh@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22304013, 51, 'Sonnu', 'Tietaah', 'Male', '2004-11-09', '0240100051', 'stietaah@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22302188, 52, 'Van Jerry', 'Quansah', 'Male', '2003-03-17', '0240100052', 'vjquansah@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22299949, 53, 'William', 'Enchill', 'Male', '2004-08-24', '0240100053', 'wenchill@st.ug.edu.gh', 'BSc. Computer Engineering', 200),
(22415339, 54, 'Kelvin Kwesi', 'Saah', 'Male', '2003-10-02', '0240100054', 'kksaah@st.ug.edu.gh', 'Education in Engineering', 200),
(22328334, 55, 'Hannah Seyram', 'Etsey', 'Female', '2004-04-14', '0240100055', 'hsetsey@st.ug.edu.gh', 'Education in Engineering', 200),
(22412982, 56, 'Mini', 'Adu', 'Female', '2003-07-19', '0240100056', 'madu@st.ug.edu.gh', 'Education in Engineering', 200),
(22321110, 57, 'Gideon Nana Osei', 'Amofa', 'Male', '2004-02-03', '0240100057', 'gnoamofa@st.ug.edu.gh', 'Education in Engineering', 200),
(22306021, 58, 'Paul Badu', 'Amponsah', 'Male', '2003-09-12', '0240100058', 'pbamponsah@st.ug.edu.gh', 'Education in Engineering', 200),
(22385391, 59, 'Najiib Abdul-Majeed', 'Stephen', 'Male', '2004-05-28', '0240100059', 'namstephen@st.ug.edu.gh', 'Education in Engineering', 200),
(22394866, 60, 'Joshua Kwame', 'Asirifi', 'Male', '2003-12-11', '0240100060', 'jkasirifi@st.ug.edu.gh', 'Education in Engineering', 200),
(22382601, 61, 'Juliet', 'Eklou', 'Female', '2004-01-31', '0240100061', 'jeklou@st.ug.edu.gh', 'Education in Engineering', 200),
(22271867, 62, 'De-Andra Rebecca', 'Ayebo', 'Female', '2003-06-20', '0240100062', 'drayebo@st.ug.edu.gh', 'Education in Engineering', 200),
(22401818, 63, 'Mas''ud', 'Nasir', 'Male', '2004-10-07', '0240100063', 'mnasir@st.ug.edu.gh', 'Education in Engineering', 200),
(22407018, 64, 'Daniel Dwomoh', 'Frimpong', 'Male', '2003-08-15', '0240100064', 'ddfrimpong@st.ug.edu.gh', 'Education in Engineering', 200),
(22376708, 65, 'Priscilla', 'Adjei', 'Female', '2004-03-22', '0240100065', 'padjei@st.ug.edu.gh', 'Education in Engineering', 200),
(22377537, 66, 'Reuben', 'Adomako', 'Male', '2003-11-04', '0240100066', 'radomako@st.ug.edu.gh', 'Education in Engineering', 200),
(22400543, 67, 'Frederick', 'Ocansey', 'Male', '2004-07-16', '0240100067', 'focansey@st.ug.edu.gh', 'Education in Engineering', 200),
(22402666, 68, 'Darlington', 'Dogbatse', 'Male', '2003-02-28', '0240100068', 'ddogbatse@st.ug.edu.gh', 'Education in Engineering', 200),
(22416112, 69, 'Troy', 'Thomas', 'Male', '2004-09-10', '0240100069', 'tthomas@st.ug.edu.gh', 'Education in Engineering', 200),
(22395074, 70, 'Lydia', 'Tiwaah', 'Female', '2003-04-25', '0240100070', 'ltiwaah@st.ug.edu.gh', 'Education in Engineering', 200);

SELECT setval('academic.students_student_number_seq', (SELECT MAX(student_number) FROM academic.students));

-- PAYMENTS
INSERT INTO finance.student_payments (student_id, fee_id, payment_date, amount_paid)
SELECT student_id, 1, CURRENT_TIMESTAMP, 3500.00 
FROM academic.students
WHERE student_id NOT IN (22357814, 22375367, 22415339);

INSERT INTO finance.student_payments (student_id, fee_id, payment_date, amount_paid)
SELECT student_id, 2, CURRENT_TIMESTAMP, 3500.00 
FROM academic.students 
WHERE student_id NOT IN (22357814, 22375367, 22415339);

INSERT INTO finance.student_payments (student_id, fee_id, payment_date, amount_paid) VALUES
(22357814, 1, CURRENT_TIMESTAMP, 2000.00),
(22375367, 1, CURRENT_TIMESTAMP, 1500.00),
(22415339, 1, CURRENT_TIMESTAMP, 3800.00);

-- LECTURER & TA ASSIGNMENTS
INSERT INTO faculty.lecturer_course_assignment (lecturer_id, course_id, academic_year, semester) VALUES
(1, 1, '2025/2026', 1),
(2, 2, '2025/2026', 1),
(3, 3, '2025/2026', 1),
(4, 4, '2025/2026', 2),
(2, 5, '2025/2026', 2);

INSERT INTO faculty.ta_assignment (lecturer_id, ta_id, course_id, academic_year, semester) VALUES
(1, 1, 1, '2025/2026', 1),
(2, 2, 2, '2025/2026', 1),
(3, 3, 3, '2025/2026', 1),
(4, 2, 4, '2025/2026', 2),
(2, 3, 5, '2025/2026', 2);