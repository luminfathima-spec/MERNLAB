/**
 * Lab 6: Full-Stack MERN Student Task & Grade Tracker Backend
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3006;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let tasks = [
  { id: 1, title: 'Network Security Lab Report', subject: 'Cybersecurity', dueDate: '2026-11-20', grade: 'A', status: 'Completed' },
  { id: 2, title: 'Java Multithreading Assignment', subject: 'Advanced Java', dueDate: '2026-11-24', grade: 'Pending', status: 'In Progress' },
  { id: 3, title: 'Full Stack MERN Evaluation', subject: 'Web Architecture', dueDate: '2026-11-28', grade: 'Pending', status: 'Pending' }
];

app.get('/api/tasks', (req, res) => {
  res.json({ success: true, count: tasks.length, tasks });
});

app.post('/api/tasks', (req, res) => {
  const { title, subject, dueDate, status } = req.body;
  if (!title || !subject) {
    return res.status(400).json({ success: false, message: 'Title and subject are required.' });
  }

  const newTask = {
    id: Date.now(),
    title,
    subject,
    dueDate: dueDate || new Date().toISOString().split('T')[0],
    grade: 'Pending',
    status: status || 'Pending'
  };
  tasks.unshift(newTask);
  res.status(201).json({ success: true, task: newTask });
});

app.patch('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

  if (req.body.status) task.status = req.body.status;
  if (req.body.grade) task.grade = req.body.grade;

  res.json({ success: true, task });
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.json({ success: true, message: 'Task deleted' });
});

app.listen(PORT, () => {
  console.log(`[Lab 6 Capstone] Running at http://localhost:${PORT}`);
});
