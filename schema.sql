-- MySQL Schema for Job Search Platform
-- Production-grade authentication with hashed tokens and device sessions

CREATE DATABASE IF NOT EXISTS jobsgpt;
USE jobsgpt;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  reset_token_hash VARCHAR(255),
  reset_token_expiry DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Refresh tokens table (supports multiple devices per user)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  device_name VARCHAR(255),
  user_agent TEXT,
  ip_address VARCHAR(45),
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  resume_text TEXT,
  keywords TEXT,
  refresh_hours INT DEFAULT 24,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_score ON jobs(score);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_reset_token ON users(reset_token_hash);
