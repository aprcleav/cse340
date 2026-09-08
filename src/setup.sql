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
