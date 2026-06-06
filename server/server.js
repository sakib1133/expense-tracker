const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 5001;
const DATA_FILE = path.join(__dirname, 'data', 'expenses.json');

app.use(cors());
app.use(express.json());

// GET / - Root route
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running');
});

// Initialize data file if it doesn't exist
async function initDataFile() {
  try {
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, '[]');
    }
  } catch (error) {
    console.error('Error initializing data file:', error);
  }
}

// Read expenses from JSON file
async function readExpenses() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading expenses:', error);
    return [];
  }
}

// Write expenses to JSON file
async function writeExpenses(expenses) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(expenses, null, 2));
  } catch (error) {
    console.error('Error writing expenses:', error);
    throw error;
  }
}

// GET /expenses - Get all expenses
app.get('/expenses', async (req, res) => {
  try {
    const expenses = await readExpenses();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read expenses' });
  }
});

// POST /expenses - Create a new expense
app.post('/expenses', async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    
    if (!amount || !category || !date) {
      return res.status(400).json({ error: 'Amount, category, and date are required' });
    }

    const expenses = await readExpenses();
    const newExpense = {
      id: uuidv4(),
      amount: parseFloat(amount),
      category,
      date,
      note: note || '',
      createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    expenses.push(newExpense);
    await writeExpenses(expenses);
    
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// PUT /expenses/:id - Update an expense
app.put('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, date, note } = req.body;

    const expenses = await readExpenses();
    const index = expenses.findIndex(exp => exp.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    expenses[index] = {
      ...expenses[index],
      amount: amount !== undefined ? parseFloat(amount) : expenses[index].amount,
      category: category || expenses[index].category,
      date: date || expenses[index].date,
      note: note !== undefined ? note : expenses[index].note
    };

    await writeExpenses(expenses);
    res.json(expenses[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// DELETE /expenses/:id - Delete an expense
app.delete('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const expenses = await readExpenses();
    const filteredExpenses = expenses.filter(exp => exp.id !== id);

    if (expenses.length === filteredExpenses.length) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await writeExpenses(filteredExpenses);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// Initialize and start server
initDataFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
