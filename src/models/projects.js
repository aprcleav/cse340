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

// Export the model functions
export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails };