import { getUpcomingProjects, getProjectDetails, createProject } from "../models/projects.js";
import { getCategoriesByProjectId } from "../models/categories.js";
import { getAllOrganizations } from "../models/organizations.js";
import { body, validationResult } from "express-validator";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project title is required.')
        .isLength({ min: 3, max: 200 })
        .withMessage('Project title must be between 3 and 200 characters long.'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required.')
        .isLength({ max: 1000 })
        .withMessage('Project description must be less than 1000 characters long.'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Project location is required.')
        .isLength({ max: 200 })
        .withMessage('Project location must be less than 200 characters long.'),
    body('date')
        .notEmpty()
        .withMessage('Project date is required.')
        .isISO8601()
        .withMessage('Please enter a valid date.'),
    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required.')
        .isInt({ min: 1 })
        .withMessage('Please select a valid organization.')
];

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Service Projects';
    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectDetails(projectId);
    const categories = await getCategoriesByProjectId(projectId);
    const title = 'Project Details';
    res.render('project', { title, project, categories });
}

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Validation failed - loop through errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        // Redirect back to the new project form
        return res.redirect('/new-project');;
    }

    // Extract form data from the request body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create a new project in the database
        const newProjectId = await createProject(title, description, location, date, organizationId);
        // Set a success flash message
        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        // Set an error flash message
        console.error('Error creating new service project:', error);
        req.flash('error', 'Failed to create service project.');
        res.redirect('/new-project');
    }

    
};

export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation };