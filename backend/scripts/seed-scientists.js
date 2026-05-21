import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Scientist from '../src/models/Scientist.js';

dotenv.config({ path: '../.env.example' }); // Fallback to example if .env missing during dev

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grifa';

const SCIENTISTS = [
  {
    name: 'Dr. Jane Smith',
    institution: 'Global Health Institute',
    expertise: 'Epidemiology & Public Health',
    tags: ['Public Health', 'Data Analysis'],
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
    disciplines: ['Medical Sciences'],
  },
  {
    name: 'Prof. David Chen',
    institution: 'Tech for Good Lab',
    expertise: 'AI & Sustainable Tech',
    tags: ['Machine Learning', 'Sustainability'],
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300',
    disciplines: ['Computer Science'],
  },
  {
    name: 'Dr. Maria Garcia',
    institution: 'Climate Action Network',
    expertise: 'Environmental Science',
    tags: ['Climate Change', 'Ecology'],
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    disciplines: ['Environmental Science'],
  },
  {
    name: 'Dr. Rajesh Kumar',
    institution: 'Institute for Advanced Materials',
    expertise: 'Nanotechnology & Clean Energy',
    tags: ['Materials Science', 'Renewable Energy'],
    photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    disciplines: ['Physics', 'Engineering'],
  },
  {
    name: 'Prof. Sarah Jenkins',
    institution: 'Center for Educational Equity',
    expertise: 'Education Policy & EdTech',
    tags: ['Education Policy', 'EdTech'],
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    disciplines: ['Social Sciences', 'Education'],
  },
  {
    name: 'Dr. Omar Tariq',
    institution: 'Global Food Security Initiative',
    expertise: 'Agricultural Sciences',
    tags: ['Agriculture', 'Food Security', 'Genetics'],
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300',
    disciplines: ['Biological Sciences'],
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Optional: Clear existing
    // await Scientist.deleteMany({});
    
    const docs = SCIENTISTS.map(s => ({
      name: s.name,
      institution: s.institution,
      specialization: s.expertise,
      tags: s.tags,
      image_url: s.photoUrl,
      disciplines: s.disciplines,
      status: 'active',
    }));

    await Scientist.insertMany(docs);
    console.log(`Seeded ${docs.length} scientists successfully.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding scientists:', error);
    process.exit(1);
  }
}

seed();
