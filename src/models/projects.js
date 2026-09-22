import db from './db.js'

const getAllProjects = async () => {
    const query = `
    SELECT
        sp.project_id,
        sp.title,
        sp.description,
        sp.locations,
        sp.project_date,
        o.name AS organization_name
    FROM public.service_projects AS sp
    JOIN public.organization AS o
        ON sp.organization_id = o.organization_id;
`;

    const result = await db.query(query);

    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          locations,
          project_date
        FROM public.service_projects
        WHERE organization_id = $1
        ORDER BY project_date;
      `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
    const query = `
    SELECT
        sp.project_id,
        sp.title,
        sp.description,
        sp.project_date AS date,
        sp.locations AS location,
        sp.organization_id,
        o.name AS organization_name
    FROM public.service_projects AS sp
    JOIN public.organization AS o
        ON sp.organization_id = o.organization_id
    WHERE sp.project_date >= CURRENT_DATE
    ORDER BY sp.project_date ASC
    LIMIT $1;
`;

    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);

    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.project_date AS date,
            sp.locations AS location,
            sp.organization_id,
            o.name AS organization_name
        FROM public.service_projects AS sp
        JOIN public.organization AS o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows[0];
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
        INSERT INTO public.service_projects (title, description, locations, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;
    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }
    return result.rows[0].project_id;
};

const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
        UPDATE public.service_projects
        SET title = $1, description = $2, locations = $3, project_date = $4, organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;
    const queryParams = [title, description, location, date, organizationId, projectId];
    const result = await db.query(query, queryParams);
    if (result.rows.length === 0) {
        throw new Error('Failed to update project');
    }
    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', projectId);
    }
    return projectId;
};

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails, createProject, updateProject };