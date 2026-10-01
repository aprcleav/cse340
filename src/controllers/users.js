import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! You can now log in.');
        return res.redirect('/');

    } catch (error) {
        console.error('Error during user registration:', error);
        req.flash('error', 'Registration failed. Please try again.');
        return res.redirect('/register');
    }   
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    const user = await authenticateUser(email, password);

    try {
        if (user) {
            // Store user info in session and redirect to home page
            req.session.user = user;
            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            return res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        return res.redirect('/login');
    }
    
};

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }
    req.flash('success', 'You have been logged out.');
    res.redirect('/');
}

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in to access this page.');
        res.redirect('/login');
    }
    next();
};

const showDashboard = (req, res) => {
    // Get user information from the session
    const name = req.session.user.name;
    const email = req.session.user.email;

    // Render the dashboard view with user information
    res.render('dashboard', { title: 'Dashboard', name, email });
}

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role, redirectTo = '/') => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session.user || !req.session) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user has the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You are not authorized to access this page.');
            return res.redirect(redirectTo);
        } 
        
        // Continue if user has required role
        next();
        
    };
};

const showRegisteredUsers = async (req, res) => {
    const users = await getAllUsers();
    
    // Render the registered users view with user information
    res.render('registered-users', { title: 'Registered Users', users });
};

export { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard, requireRole, showRegisteredUsers };
