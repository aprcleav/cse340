import { body, validationResult } from 'express-validator';
import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    getCategoriesByProjectId,
    updateCategoryAssignments,
    updateCategory, createCategory
} from "../models/categories.js";
import { getProjectDetails } from "../models/projects.js";

// Define validation rules for category form
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Project Categories';
    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const serviceProjects = await getProjectsByCategoryId(categoryId);
    const title = 'Category Details';
    res.render('category', { title, category, serviceProjects });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || []; // Get selected category IDs from the form submission

    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);

    // Set a success flash message
    req.flash('success', 'Categories assigned successfully!');

    res.redirect(`/project/${projectId}`);
};

const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';

    res.render('new-category', { title });
};

const processNewCategoryForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        res.redirect(`/new-category`);
        return;
    }

    const { name } = req.body;
    await createCategory(name);

    req.flash('success', 'Category created successfully!');
    res.redirect('/categories');
};

const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const categoryDetails = await getCategoryById(categoryId);
    const title = 'Edit Category';

    res.render('edit-category', { title, categoryDetails });
};

const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        res.redirect(`/edit-category/${categoryId}`);
        return;
    }

    const { name } = req.body;

    await updateCategory(categoryId, name);

    req.flash('success', 'Category updated successfully!');
    res.redirect(`/categories`);
};

export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm, categoryValidation };