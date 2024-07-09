const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const DATA_FILE = path.join(__dirname, 'data.json');

// Read data from data.json
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
};

// Write data to data.json
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Create
app.post('/users', (req, res) => {
  const users = readData();
  const user = req.body;
  users.push(user);
  writeData(users);
  res.status(201).send(user);
});

// Read
app.get('/users', (req, res) => {
  const users = readData();
  res.status(200).send(users);
});

// Update
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedUser = req.body;
  let users = readData();
  users = users.map((user, index) => (index === id ? updatedUser : user));
  writeData(users);
  res.status(200).send(updatedUser);
});

// Delete
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let users = readData();
  users = users.filter((_, index) => index !== id);
  writeData(users);
  res.status(200).send({ message: 'User deleted' });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
