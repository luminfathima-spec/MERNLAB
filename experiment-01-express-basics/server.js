/**
 * Experiment 1: Express REST API Foundations
 * Demonstrates routing, status codes, query params, and middleware
 */

import express from 'express';

const app = express();
const PORT = 3001;

app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

let items = [
  { id: 1, name: 'Data Structures Lab Notes', category: 'Study', completed: true },
  { id: 2, name: 'Cloud Computing Mini-Project', category: 'Project', completed: false }
];

app.get('/api/items', (req, res) => {
  res.json({ success: true, count: items.length, data: items });
});

app.post('/api/items', (req, res) => {
  const { name, category } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: 'Item name is required' });
  }
  const newItem = { id: items.length + 1, name, category: category || 'General', completed: false };
  items.push(newItem);
  res.status(201).json({ success: true, data: newItem });
});

app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  items = items.filter(i => i.id !== id);
  res.json({ success: true, message: `Item ${id} deleted` });
});

app.listen(PORT, () => {
  console.log(`[Lab 1 Server] Running on http://localhost:${PORT}`);
});
