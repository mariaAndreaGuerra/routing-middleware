const express = require('express');
const bodyParser = require('body-parser');
const items = require('./fakeDb');

const app = express();
app.use(bodyParser.json());

// Route to render a list of shopping items
app.get('/items', (req, res) => {
  res.json(items);
});

// Route to add an item to the shopping list
app.post('/items', (req, res) => {
  const newItem = req.body;
  items.push(newItem);
  res.json({ added: newItem });
});

// Route to display a single item's name and price
app.get('/items/:name', (req, res) => {
  const itemName = req.params.name;
  const foundItem = items.find(item => item.name === itemName);
  if (!foundItem) {
    res.status(404).json({ message: "Item not found" });
  } else {
    res.json(foundItem);
  }
});

// Route to modify a single item's name and/or price
app.patch('/items/:name', (req, res) => {
  const itemName = req.params.name;
  const updatedItem = req.body;
  let found = false;
  items.forEach(item => {
    if (item.name === itemName) {
      item.name = updatedItem.name || item.name;
      item.price = updatedItem.price || item.price;
      found = true;
    }
  });
  if (found) {
    res.json({ updated: updatedItem });
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// Route to delete a specific item from the array
app.delete('/items/:name', (req, res) => {
  const itemName = req.params.name;
  const index = items.findIndex(item => item.name === itemName);
  if (index !== -1) {
    items.splice(index, 1);
    res.json({ message: "Deleted" });
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
