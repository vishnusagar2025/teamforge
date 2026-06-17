-- Team Forge Database Schema

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(120) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    roll_number VARCHAR(30) UNIQUE,
    institution VARCHAR(150),
    department VARCHAR(100),
    year_of_study INTEGER,
    linkedin_url VARCHAR(200),
    portfolio_url VARCHAR(200),
    resume_url VARCHAR(200),
    avatar_url VARCHAR(200) DEFAULT '/default-avatar.png',
    is_looking_for_team BOOLEAN DEFAULT TRUE,
    commitment_level VARCHAR(20) DEFAULT 'serious',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    github_url VARCHAR(200),
    achievements TEXT,
    hackathons_participated INTEGER DEFAULT 0,
    projects_completed INTEGER DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(80) NOT NULL,
    level VARCHAR(20) DEFAULT 'intermediate',
    category VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS interests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(80) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    leader_id INTEGER REFERENCES users(id),
    institution VARCHAR(150),
    max_members INTEGER DEFAULT 4,
    is_open BOOLEAN DEFAULT TRUE,
    hackathon_name VARCHAR(200),
    project_domain VARCHAR(100),
    required_skills TEXT,
    commitment_level VARCHAR(20) DEFAULT 'serious',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS team_members (
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (team_id, user_id)
);

CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    team_id INTEGER REFERENCES teams(id),
    creator_id INTEGER REFERENCES users(id),
    domain VARCHAR(100),
    tech_stack TEXT,
    github_url VARCHAR(200),
    demo_url VARCHAR(200),
    status VARCHAR(30) DEFAULT 'planning',
    is_looking_for_members BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150),
    message TEXT NOT NULL,
    notif_type VARCHAR(30) DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    reference_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
