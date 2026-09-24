import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, organizationValidation, showEditOrganizationForm, processEditOrganizationForm } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, categoryValidation, showEditCategoryForm, processEditCategoryForm, showNewCategoryForm, processNewCategoryForm } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';



const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/categories', showCategoriesPage);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;

// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);

//Route for project details page
router.get('/project/:id', showProjectDetailsPage);

//Route for category details page
router.get('/category/:id', showCategoryDetailsPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

// Route to display the edit organization form
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route to handle edit organization form submission
router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm);

// Route to display the new project form
router.get('/new-project', showNewProjectForm);

// Route to handle new project form submission
router.post('/new-project', projectValidation, processNewProjectForm);

// Route to display the assign categories form
router.get('/assign-categories/:projectId', showAssignCategoriesForm);

// Route to handle assign categories form submission
router.post('/assign-categories/:projectId', processAssignCategoriesForm);

// Route to display the edit project form
router.get('/edit-project/:id', showEditProjectForm);

// Route to handle edit project form submission
router.post('/edit-project/:id', projectValidation, processEditProjectForm);

// Route to display the new category form
router.get('/new-category', showNewCategoryForm);

// Route to handle new category form submission
router.post('/new-category', categoryValidation, processNewCategoryForm);

// Route to display the edit category form
router.get('/edit-category/:id', showEditCategoryForm);

// Route to handle edit category form submission
router.post('/edit-category/:id', categoryValidation, processEditCategoryForm);
