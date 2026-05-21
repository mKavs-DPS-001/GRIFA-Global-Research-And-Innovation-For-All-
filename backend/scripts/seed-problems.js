import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Problem from '../src/models/Problem.js';

dotenv.config({ path: '../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grifa';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const problemsDataDir = path.join(__dirname, '../../src/data/problems');

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const files = fs.readdirSync(problemsDataDir).filter(f => f.endsWith('.js'));
    let totalProblems = 0;
    
    for (const file of files) {
      const filePath = `file://${path.join(problemsDataDir, file).replace(/\\/g, '/')}`;
      const module = await import(filePath);
      
      for (const exportKey of Object.keys(module)) {
        const categoryMap = module[exportKey];
        
        for (const [categoryName, problemsArray] of Object.entries(categoryMap)) {
          for (const p of problemsArray) {
            const slug = generateSlug(p.title);
            
            try {
              await Problem.updateOne(
                { slug },
                {
                  $setOnInsert: {
                    title: p.title,
                    description: p.description,
                    details: p.description, // fallback if details not present
                    disciplines: p.disciplines || [],
                    tags: [...(p.disciplines || []), categoryName],
                    status: 'active',
                    views: Math.floor(Math.random() * 5000), // dummy views for display
                    is_featured: Math.random() > 0.8
                  }
                },
                { upsert: true }
              );
              totalProblems++;
            } catch (err) {
              console.error(`Error inserting ${slug}:`, err.message);
            }
          }
        }
      }
    }

    console.log(`Successfully seeded ${totalProblems} problems.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding problems:', error);
    process.exit(1);
  }
}

seed();
