import db from './db.js';
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user'; // Default role for new users
    const query = `
    INSERT INTO users (name, email, password_hash, role_id) 
    VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4))
        RETURNING user_id`;

    const queryParams = [name, email, passwordHash, default_role];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
    SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    WHERE u.email = $1`;

    const queryParams = [email];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

const verifyPassword = async (password, passwordHash) => {
    // Placeholder for password verification logic (e.g., using bcrypt)
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) {
        return null;
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
        return null;
    }

    // Remove the password_hash from the user object before returning it
    delete user.password_hash;
    return user;
};

const getAllUsers = async () => {
    const query = `
    SELECT u.user_id, u.name, u.email, r.role_name
    FROM users u
    JOIN roles r ON u.role_id = r.role_id`;

    const result = await db.query(query);
    return result.rows;
};

const addProjectToUser = async (userId, projectId) => {
    const query = `
    INSERT INTO user_has_project (user_id, project_id)
    VALUES ($1, $2)
        RETURNING project_id`;

    const result = await db.query(query, [userId, projectId]);

    if (result.rows.length === 0) {
        throw new Error('Failed to volunteer for project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('User volunteered for project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
};

const removeProjectFromUser = async (userId, projectId) => {
    const query = `
    DELETE FROM user_has_project
    WHERE user_id = $1 AND project_id = $2
    RETURNING project_id`;

    const result = await db.query(query, [userId, projectId]);

    if (result.rows.length === 0) {
        throw new Error('Failed to remove project from user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Project removed from user with ID:', projectId);
    }

    return result.rows[0].project_id;
};

const getUserProjects = async (userId) => {
    const query = `
    SELECT p.project_id, p.title, p.description
    FROM service_projects p
    JOIN user_has_project uhp ON p.project_id = uhp.project_id
    WHERE uhp.user_id = $1`;

    const result = await db.query(query, [userId]);
    return result.rows;
};

const hasUserVolunteered = async (userId, projectId) => {
    const query = `
    SELECT EXISTS (
        SELECT 1
        FROM user_has_project
        WHERE user_id = $1 AND project_id = $2
    ) AS has_volunteered`;

    const result = await db.query(query, [userId, projectId]);
    return result.rows[0].has_volunteered;
};

export { createUser, authenticateUser, getAllUsers, addProjectToUser, removeProjectFromUser, getUserProjects, hasUserVolunteered };