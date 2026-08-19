-- =========================================================================
-- IBN HAJAR FOUNDATION-ZARIA — Supabase Database Schema
-- Run this in your Supabase project's SQL Editor (Project → SQL Editor → New query)
-- after creating the project. This creates every table, relationship, and
-- security rule needed for the real (non-demo) login and records system.
-- =========================================================================

-- ---------- EXTENSIONS ----------
create extension if not exists "uuid-ossp";

-- ---------- PROFILES (one row per staff/parent login, linked to Supabase Auth) ----------
create type user_role as enum ('principal','admin','bursary','class_teacher','parent');
create type account_status as enum ('active','blocked');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  username text unique not null,
  role user_role not null,
  status account_status not null default 'active',
  assigned_class_id uuid,              -- set for class_teacher role
  must_change_password boolean default true,
  created_at timestamptz default now()
);

-- ---------- SESSIONS & TERMS ----------
create table sessions (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,           -- e.g. '2026/2027'
  is_current boolean default false
);

create table terms (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references sessions(id) on delete cascade,
  term_number int not null check (term_number in (1,2,3)),
  is_current boolean default false,
  unique (session_id, term_number)
);

-- ---------- CLASSES ----------
create table classes (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,           -- e.g. 'Primary 4', 'JSS 1'
  level text not null check (level in ('Primary','JSS')),
  class_teacher_id uuid references profiles(id)
);

alter table profiles add constraint fk_assigned_class
  foreign key (assigned_class_id) references classes(id);

-- ---------- STUDENTS ----------
create type student_status as enum ('active','graduated','withdrawn');

create table students (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  date_of_birth date,
  gender text check (gender in ('Male','Female')),
  current_class_id uuid references classes(id),
  guardian_name text,
  guardian_phone text,
  guardian_email text,
  guardian_address text,
  previous_school text,
  passport_photo_url text,
  admission_number text unique,
  admission_date date default current_date,
  status student_status default 'active',
  created_at timestamptz default now()
);

-- Links parent accounts to their child/children (supports more than one child per parent)
create table parent_student_links (
  parent_id uuid references profiles(id) on delete cascade,
  student_id uuid references students(id) on delete cascade,
  primary key (parent_id, student_id)
);

-- ---------- SUBJECTS (teachers can add new ones freely; this just prevents typo-duplicates) ----------
create table subjects (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null
);

-- ---------- RESULTS (this is what accumulates a student's full P1→JSS3 history) ----------
create type grade_value as enum ('Excellent','Good','Fair');

create table results (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references students(id) on delete cascade,
  subject_id uuid references subjects(id),
  class_at_time_id uuid references classes(id),   -- class the student was in when this was recorded
  term_id uuid references terms(id),
  grade grade_value not null,
  remark text,
  entered_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (student_id, subject_id, term_id)         -- re-saving updates instead of duplicating
);

-- ---------- ATTENDANCE ----------
create type attendance_status as enum ('present','absent','late');

create table attendance (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references students(id) on delete cascade,
  class_id uuid references classes(id),
  date date not null,
  status attendance_status not null,
  marked_by uuid references profiles(id),
  created_at timestamptz default now(),
  unique (student_id, date)
);

-- ---------- FEES ----------
create table fee_types (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null    -- Tuition, Security, Hostel, Hygiene, Feeding, Textbooks, Uniform
);

create table fee_structure (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references sessions(id),
  class_id uuid references classes(id),
  fee_type_id uuid references fee_types(id),
  amount numeric(12,2) not null,
  unique (session_id, class_id, fee_type_id)
);

create table fee_payments (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid references students(id) on delete cascade,
  fee_type_id uuid references fee_types(id),
  term_id uuid references terms(id),
  amount_paid numeric(12,2) not null,
  payment_date date default current_date,
  recorded_by uuid references profiles(id),
  notes text,
  created_at timestamptz default now()
);

-- ---------- EXPENSES (institutional spending, separate from fee income) ----------
create table expenses (
  id uuid primary key default uuid_generate_v4(),
  description text not null,
  category text not null,
  amount numeric(12,2) not null,
  expense_date date default current_date,
  recorded_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- ---------- ADMISSIONS ----------
create type admission_status as enum ('pending','approved','rejected');

create table applicant_accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  created_at timestamptz default now()
);

create table admissions_applications (
  id uuid primary key default uuid_generate_v4(),
  applicant_id uuid references applicant_accounts(id),
  student_full_name text not null,
  date_of_birth date,
  gender text,
  class_applying_for text,
  previous_school text,
  guardian_name text,
  guardian_phone text,
  guardian_email text,
  guardian_address text,
  passport_photo_url text,
  status admission_status default 'pending',
  submitted_at timestamptz default now(),
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz
);

-- ---------- ANNOUNCEMENTS ----------
create table announcements (
  id uuid primary key default uuid_generate_v4(),
  message text not null,
  posted_by uuid references profiles(id),
  posted_at timestamptz default now()
);

-- ---------- SITE SETTINGS (homepage banner, school info) ----------
create table site_settings (
  key text primary key,
  value text
);

-- ---------- GALLERY ----------
create table gallery_images (
  id uuid primary key default uuid_generate_v4(),
  storage_path text not null,   -- Supabase Storage object path
  caption text,
  uploaded_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- =========================================================================
-- ROW LEVEL SECURITY — each role only sees what it should
-- =========================================================================
alter table profiles enable row level security;
alter table students enable row level security;
alter table results enable row level security;
alter table attendance enable row level security;
alter table fee_payments enable row level security;
alter table expenses enable row level security;
alter table admissions_applications enable row level security;
alter table announcements enable row level security;
alter table parent_student_links enable row level security;
alter table gallery_images enable row level security;

-- Helper: current user's role
create or replace function my_role() returns user_role as $$
  select role from profiles where id = auth.uid();
$$ language sql stable;

create or replace function my_status() returns account_status as $$
  select status from profiles where id = auth.uid();
$$ language sql stable;

-- PROFILES: everyone can read their own row; principal can read/manage all
create policy "read own profile" on profiles for select using (id = auth.uid());
create policy "principal reads all profiles" on profiles for select using (my_role() = 'principal');
create policy "principal manages profiles" on profiles for all using (my_role() = 'principal');
create policy "user updates own password fields" on profiles for update using (id = auth.uid());

-- STUDENTS: principal/admin/bursary see all; class_teacher sees/manages only their class; parent sees only their linked child
create policy "staff full read" on students for select using (my_role() in ('principal','admin','bursary'));
create policy "principal admin manage students" on students for all using (my_role() in ('principal','admin'));
create policy "teacher manages own class students" on students for all using (
  my_role() = 'class_teacher' and current_class_id = (select assigned_class_id from profiles where id = auth.uid())
);
create policy "parent reads own child" on students for select using (
  my_role() = 'parent' and id in (select student_id from parent_student_links where parent_id = auth.uid())
);

-- RESULTS: teacher inserts/updates/deletes only for their class; principal/admin read all; parent reads only their child's
create policy "principal admin read all results" on results for select using (my_role() in ('principal','admin'));
create policy "teacher manages own class results" on results for all using (
  my_role() = 'class_teacher' and class_at_time_id = (select assigned_class_id from profiles where id = auth.uid())
);
create policy "parent reads child results" on results for select using (
  my_role() = 'parent' and student_id in (select student_id from parent_student_links where parent_id = auth.uid())
);

-- ATTENDANCE: teacher manages their own class only; principal/admin read all
create policy "teacher manages own class attendance" on attendance for all using (
  my_role() = 'class_teacher' and class_id = (select assigned_class_id from profiles where id = auth.uid())
);
create policy "principal admin read attendance" on attendance for select using (my_role() in ('principal','admin'));

-- FEES & EXPENSES: bursary/principal manage & read all; parent reads only their child's payments
create policy "bursary principal manage fees" on fee_payments for all using (my_role() in ('principal','bursary'));
create policy "parent reads child fees" on fee_payments for select using (
  my_role() = 'parent' and student_id in (select student_id from parent_student_links where parent_id = auth.uid())
);
create policy "bursary principal manage expenses" on expenses for all using (my_role() in ('principal','bursary'));

-- ADMISSIONS: applicants manage only their own submissions; admin/principal read & review all
create policy "applicant manages own applications" on admissions_applications for all using (applicant_id = auth.uid());
create policy "admin principal read applications" on admissions_applications for select using (my_role() in ('principal','admin'));
create policy "admin principal review applications" on admissions_applications for update using (my_role() in ('principal','admin'));
create policy "admin principal delete applications" on admissions_applications for delete using (my_role() in ('principal','admin'));

-- ANNOUNCEMENTS: everyone reads; admin/principal post and delete
create policy "everyone reads announcements" on announcements for select using (true);
create policy "admin principal manage announcements" on announcements for all using (my_role() in ('principal','admin'));

-- GALLERY: everyone reads; principal manages (add/remove) without limit
create policy "everyone reads gallery" on gallery_images for select using (true);
create policy "principal manages gallery" on gallery_images for all using (my_role() = 'principal');

-- =========================================================================
-- SEED DATA
-- =========================================================================
insert into sessions (name, is_current) values ('2026/2027', true);
insert into classes (name, level) values
  ('Primary 1','Primary'),('Primary 2','Primary'),('Primary 3','Primary'),
  ('Primary 4','Primary'),('Primary 5','Primary'),('Primary 6','Primary'),
  ('JSS 1','JSS'),('JSS 2','JSS'),('JSS 3','JSS');
insert into fee_types (name) values
  ('Tuition'),('Security'),('Hostel'),('Hygiene'),('Feeding'),('Textbooks'),('Uniform');
insert into site_settings (key, value) values
  ('homepage_banner', 'Admission Now Open — 2026/2027 Session. Enrol your child in our Qur''an memorization & academic boarding programme. <a href="apply.html">Apply today →</a>'),
  ('school_name', 'IBN HAJAR FOUNDATION-ZARIA'),
  ('school_address', 'No. 52 Unguwar Katuka, Zaria City'),
  ('current_session', '2026/2027');

-- Note: staff/parent/applicant accounts are created through Supabase Auth
-- (sign-up), not inserted directly here — the app's account-creation screens
-- handle that once wired up. Storage buckets (for gallery photos and
-- passport photographs) are created separately in the Supabase Storage tab.
