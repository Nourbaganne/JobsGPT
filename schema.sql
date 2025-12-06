-- MySQL Schema for Job Search Platform
-- Run this script to create the database and tables

CREATE DATABASE IF NOT EXISTS job_search;
USE job_search;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  resume_text TEXT,
  keywords TEXT,
  refresh_hours INT DEFAULT 24,
  next_run DATETIME,
  reset_token VARCHAR(255) UNIQUE,
  reset_token_expiry DATETIME,
  refresh_token TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  url TEXT,
  source VARCHAR(255),
  description TEXT,
  score INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_score ON jobs(score);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_reset_token ON users(reset_token);

