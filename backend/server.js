const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// File path for JSON data
const dataFilePath = path.join(__dirname, 'shoppingList.json');

// Ensure the JSON file exists
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

// Helper function to read data
const readData = () => {
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

// Helper function to write data
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// CRUD Endpoints

// GET all items
app.get('/shopping-list', (req, res) => {
  const data = readData();
  res.json(data);
});

// POST a new item
app.post('/shopping-list', (req, res) => {
  const data = readData();
  const newItem = { id: Date.now(), ...req.body };
  data.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

// PUT/PATCH update an item
app.put('/shopping-list/:id', (req, res) => {
  const data = readData();
  const itemId = parseInt(req.params.id);
  const updatedItem = req.body;
  const index = data.findIndex((item) => item.id === itemId);
  if (index !== -1) {
    data[index] = { ...data[index], ...updatedItem };
    writeData(data);
    res.json(data[index]);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// DELETE an item
app.delete('/shopping-list/:id', (req, res) => {
  const data = readData();
  const itemId = parseInt(req.params.id);
  const filteredData = data.filter((item) => item.id !== itemId);
  writeData(filteredData);
  res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});