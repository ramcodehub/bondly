-- Create home_content table
CREATE TABLE home_content (
  id SERIAL PRIMARY KEY,
  section TEXT NOT NULL,
  title TEXT,
  description TEXT,
  image_url TEXT,
  icon_name TEXT,
  "order" INTEGER
);

-- Create carousel_images table
CREATE TABLE carousel_images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  "order" INTEGER
);

-- Seed home_content table
INSERT INTO home_content (section, title, description, image_url, icon_name, "order")
VALUES 
  ('hero', 'Welcome to Travels App', 'Your complete travel management solution', '', '', 1),
  ('featured', 'Manage Leads', 'Track and manage all your travel leads in one place', '', 'FiUsers', 1),
  ('featured', 'Backend Connection', 'Check connection to backend services', '', 'FiServer', 2);

-- Seed carousel_images table
INSERT INTO carousel_images (image_url, caption, "order")
VALUES 
  ('https://example.com/carousel1.jpg', 'Beautiful Beach Destination', 1),
  ('https://example.com/carousel2.jpg', 'Mountain Adventure', 2),
  ('https://example.com/carousel3.jpg', 'City Tour Experience', 3);