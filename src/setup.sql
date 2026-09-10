-- Organization Table

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- Insert sample data: Organizations
INSERT INTO organization (name, description, contact_email, logo_filename) 
VALUES 
(
    'BrightFuture Builders', 
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 
    'info@brightfuturebuilders.org', 
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers', 
    'An urban farming collective promoting food sustainability and education in local neighborhoods.', 
    'contact@greenharvest.org', 
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers', 
    'A volunteer coordination group supporting local charities and service initiatives.', 
    'hello@unityserve.org', 
    'unityserve-logo.png'
);

-- Service Projects table
CREATE TABLE service_projects (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    locations VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization (organization_id)
        ON DELETE CASCADE
);

-- Insert service project data into table
INSERT INTO service_projects (organization_id, title, description, locations, project_date) VALUES
-- BrightFuture Builders Projects
((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 
 'Community Center Roof Repair', 
 'Replacing the leaky roof of the Southside Community Center.', 
 '123 Southside Ave', 
 '2027-04-15'),

((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 
 'Accessible Ramp Installation', 
 'Building wheelchair ramps for local community housing units.', 
 '456 Oak Street', 
 '2027-05-10'),

((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 
 'Sustainable Park Shelter', 
 'Constructing a solar-powered shade structure at Elm Park.', 
 '789 Elm Road', 
 '2027-06-20'),

((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 
 'Library Eco-Renovation', 
 'Installing energy-efficient windows at the public library.', 
 '321 Library Way', 
 '2027-07-12'),

((SELECT organization_id FROM organization WHERE name = 'BrightFuture Builders'), 
 'Youth Center Foundation', 
 'Pouring a new concrete foundation for the expanded youth workshop.', 
 '654 Maple Ave', 
 '2027-08-05'),

-- GreenHarvest Growers Projects
((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 
 'Urban Garden Expansion', 
 'Clearing lots to build 20 new raised garden beds.', 
 '111 Green Street', 
 '2027-04-20'),

((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 
 'Composting Workshop & Setup', 
 'Setting up community compost bins and training residents.', 
 '222 Harvest Lane', 
 '2027-05-15'),

((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 
 'School Yard Farm', 
 'Creating an educational vegetable garden at Lincoln Elementary.', 
 '333 Schoolhouse Rd', 
 '2027-06-01'),

((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 
 'Rainwater Harvesting System', 
 'Installing rain barrels to irrigate the community greenhouse.', 
 '444 Raindrop Blvd', 
 '2027-07-08'),

((SELECT organization_id FROM organization WHERE name = 'GreenHarvest Growers'), 
 'Fall Harvest Celebration', 
 'Organizing a community market featuring locally grown produce.', 
 '555 Market Square', 
 '2027-09-10'),

-- UnityServe Volunteers Projects
((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 
 'Food Bank Stocking Drive', 
 'Sorting and organizing donated food items for local families.', 
 '777 Charity Way', 
 '2027-04-10'),

((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 
 'Senior Tech Support Day', 
 'Assisting elderly residents with smartphones and computers.', 
 '888 Sunshine Senior Home', 
 '2027-05-05'),

((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 
 'Neighborhood Cleanup Initiative', 
 'Collecting litter and planting flowers along Main Street.', 
 'Main Street Corridor', 
 '2027-06-15'),

((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 
 'Winter Coat Distribution', 
 'Organizing and distributing winter clothing to those in need.', 
 '999 Hope Center', 
 '2027-11-01'),

((SELECT organization_id FROM organization WHERE name = 'UnityServe Volunteers'), 
 'Holiday Toy Drive', 
 'Wrapping and handing out holiday gifts for underprivileged children.', 
 'City Community Hall', 
 '2027-12-15');

 -- Categories table
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Junction table for the many-to-many relationship
CREATE TABLE service_project_categories (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES service_projects (project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES categories (category_id)
        ON DELETE CASCADE
);

INSERT INTO categories (name)
VALUES
    ('Construction'),
    ('Environment'),
    ('Education'),
    ('Community Service');

INSERT INTO service_project_categories (project_id, category_id)
VALUES
    -- BrightFuture Builders
    (1, 3), -- Community Center Roof Repair: Community Service
    (2, 3), -- Accessible Ramp Installation: Community Service
    (2, 4), -- Accessible Ramp Installation: Health and Wellness
    (3, 1), -- Sustainable Park Shelter: Environmental
    (3, 3), -- Sustainable Park Shelter: Community Service
    (4, 1), -- Library Eco-Renovation: Environmental
    (4, 2), -- Library Eco-Renovation: Educational
    (5, 3), -- Youth Center Foundation: Community Service

    -- GreenHarvest Growers
    (6, 1), -- Urban Garden Expansion: Environmental
    (6, 3), -- Urban Garden Expansion: Community Service
    (7, 1), -- Composting Workshop & Setup: Environmental
    (7, 2), -- Composting Workshop & Setup: Educational
    (8, 1), -- School Yard Farm: Environmental
    (8, 2), -- School Yard Farm: Educational
    (9, 1), -- Rainwater Harvesting System: Environmental
    (10, 1), -- Fall Harvest Celebration: Environmental
    (10, 3), -- Fall Harvest Celebration: Community Service

    -- UnityServe Volunteers
    (11, 3), -- Food Bank Stocking Drive: Community Service
    (11, 4), -- Food Bank Stocking Drive: Health and Wellness
    (12, 2), -- Senior Tech Support Day: Educational
    (13, 1), -- Neighborhood Cleanup Initiative: Environmental
    (13, 3), -- Neighborhood Cleanup Initiative: Community Service
    (14, 3), -- Winter Coat Distribution: Community Service
    (14, 4), -- Winter Coat Distribution: Health and Wellness
    (15, 3); -- Holiday Toy Drive: Community Service
