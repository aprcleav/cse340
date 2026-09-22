import db from './db.js'

const getAllCategories = async () => {
  const query = `
        SELECT
          category_id,
          name
      FROM public.categories;
    `;

  const result = await db.query(query);

  return result.rows;
}

const getCategoryById = async (categoryId) => {
  const query = `
    SELECT
      category_id,
      name
    FROM public.categories
    WHERE category_id = $1;
  `;

  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);

  return result.rows[0];
};

const getCategoriesByProjectId = async (projectId) => {
  const query = `
    SELECT
      c.category_id,
      c.name
    FROM public.categories AS c
    JOIN public.service_project_categories AS spc
      ON c.category_id = spc.category_id
    WHERE spc.project_id = $1
    ORDER BY c.name;
  `;

  const queryParams = [projectId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT
      sp.project_id,
      sp.organization_id,
      sp.title,
      sp.description,
      sp.locations,
      sp.project_date
    FROM public.service_projects AS sp
    JOIN public.service_project_categories AS spc
      ON sp.project_id = spc.project_id
    WHERE spc.category_id = $1
    ORDER BY sp.project_date;
  `;

  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const assignCategoryToProject = async (categoryId, projectId) => {
  const query = `
    INSERT INTO public.service_project_categories (category_id, project_id)
    VALUES ($1, $2);
  `;
  const queryParams = [categoryId, projectId];
  await db.query(query, queryParams);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
  // Delete existing category assignments for the project
  const deleteQuery = `
    DELETE FROM public.service_project_categories
    WHERE project_id = $1;
  `;

  await db.query(deleteQuery, [projectId]);

  // Insert new category assignments
  for (const categoryId of categoryIds) {
    await assignCategoryToProject(categoryId, projectId);
  }
};

export {
  getAllCategories,
  getCategoryById,
  getCategoriesByProjectId,
  getProjectsByCategoryId,
  assignCategoryToProject,
  updateCategoryAssignments
};