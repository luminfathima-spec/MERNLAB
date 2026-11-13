/**
 * Experiment 2: MongoDB & Mongoose Schema Modeling and CRUD
 */

import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = 3002;

app.use(express.json());

// Course Schema
const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  credits: { type: Number, default: 3 },
  instructor: { type: String, required: true },
  department: { type: String, default: 'Computer Applications' }
});

const Course = mongoose.model('Course', courseSchema);

// In-memory fallback dataset for offline running
let memoryCourses = [
  { courseCode: 'MCA201', title: 'Advanced Java Programming', credits: 4, instructor: 'Dr. Ramesh Kumar', department: 'MCA' },
  { courseCode: 'MCA202', title: 'Full-Stack Web Architectures', credits: 4, instructor: 'Prof. Ananya Sen', department: 'MCA' }
];

app.get('/api/courses', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const courses = await Course.find();
      return res.json({ success: true, count: courses.length, courses });
    }
    res.json({ success: true, count: memoryCourses.length, courses: memoryCourses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const { courseCode, title, credits, instructor, department } = req.body;
    if (!courseCode || !title) {
      return res.status(400).json({ success: false, message: 'courseCode and title required' });
    }

    if (mongoose.connection.readyState === 1) {
      const newCourse = await Course.create({ courseCode, title, credits, instructor, department });
      return res.status(201).json({ success: true, course: newCourse });
    }

    const memoryItem = { courseCode, title, credits: credits || 3, instructor: instructor || 'Faculty', department: department || 'MCA' };
    memoryCourses.push(memoryItem);
    res.status(201).json({ success: true, course: memoryItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Optional connection attempt
mongoose.connect('mongodb://localhost:27017/mernlab', { serverSelectionTimeoutMS: 1000 })
  .then(() => console.log('[Lab 2] Connected to MongoDB.'))
  .catch(() => console.log('[Lab 2] Running in standalone offline demonstration mode.'));

app.listen(PORT, () => {
  console.log(`[Lab 2 Server] Running on http://localhost:${PORT}`);
});
