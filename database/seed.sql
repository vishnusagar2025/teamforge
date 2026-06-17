-- Seed data for TeamForge (for testing)
-- Run AFTER schema.sql

INSERT INTO users (email, phone, password_hash, full_name, roll_number, institution, department, year_of_study, is_looking_for_team, commitment_level)
VALUES
('demo@college.edu', '9999999999', 'hashed_password', 'Demo User', '22CS001', 'Anna University', 'Computer Science Engineering', 3, 1, 'serious'),
('alice@college.edu', '8888888888', 'hashed_password', 'Alice Kumar', '22AI002', 'Anna University', 'Artificial Intelligence & Data Science', 2, 1, 'serious'),
('bob@college.edu', '7777777777', 'hashed_password', 'Bob Raj', '21EC003', 'Anna University', 'Electronics & Communication Engineering', 4, 1, 'learning');

INSERT INTO interests (user_id, category, is_primary) VALUES
(1, 'Web Development', 1), (1, 'AI/Machine Learning', 0),
(2, 'AI/Machine Learning', 1), (2, 'Data Science', 0),
(3, 'IoT & Embedded Systems', 1), (3, 'Robotics', 0);

INSERT INTO skills (user_id, name, level, category) VALUES
(1, 'React', 'intermediate', 'frontend'), (1, 'Python', 'intermediate', 'backend'),
(2, 'TensorFlow', 'beginner', 'ml'), (2, 'Python', 'intermediate', 'backend'),
(3, 'Arduino', 'expert', 'hardware'), (3, 'C/C++', 'intermediate', 'backend');
