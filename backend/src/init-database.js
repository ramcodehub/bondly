import supabase from './config/supabase.js';
import fs from 'fs';
import path from 'path';

// Function to execute SQL file
async function executeSQLFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`Executing SQL file: ${path.basename(filePath)}`);
    
    // Split SQL statements by semicolon
    const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
    
    for (const statement of statements) {
      if (statement.trim() !== '') {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        // Note: Supabase doesn't have a direct way to execute raw SQL
        // We'll need to use the Supabase client methods instead
        console.log('Skipping raw SQL execution - would need to implement via Supabase client');
      }
    }
  } catch (error) {
    console.error(`Error executing SQL file ${filePath}:`, error);
  }
}

// Function to create tables using Supabase client
async function createTables() {
  try {
    console.log('Creating database tables...');
    
    // Create hero_stats table
    const { error: heroStatsError } = await supabase.rpc('create_hero_stats_table');
    if (heroStatsError) console.error('Error creating hero_stats table:', heroStatsError);
    else console.log('hero_stats table created successfully');
    
    // Create services table
    const { error: servicesError } = await supabase.rpc('create_services_table');
    if (servicesError) console.error('Error creating services table:', servicesError);
    else console.log('services table created successfully');
    
    // Create footer_links table
    const { error: footerLinksError } = await supabase.rpc('create_footer_links_table');
    if (footerLinksError) console.error('Error creating footer_links table:', footerLinksError);
    else console.log('footer_links table created successfully');
    
    // Create about_features table
    const { error: aboutFeaturesError } = await supabase.rpc('create_about_features_table');
    if (aboutFeaturesError) console.error('Error creating about_features table:', aboutFeaturesError);
    else console.log('about_features table created successfully');
    
    // Create about_testimonials table
    const { error: aboutTestimonialsError } = await supabase.rpc('create_about_testimonials_table');
    if (aboutTestimonialsError) console.error('Error creating about_testimonials table:', aboutTestimonialsError);
    else console.log('about_testimonials table created successfully');
    
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}

// Run the initialization
createTables();