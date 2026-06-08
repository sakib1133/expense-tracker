const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5001;
const DATA_FILE = path.join(__dirname, 'data', 'expenses.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const BUDGETS_FILE = path.join(__dirname, 'data', 'budgets.json');
const JWT_SECRET = 'your-secret-key-change-this-in-production';

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
    try {
      await fs.access(USERS_FILE);
    } catch {
      await fs.writeFile(USERS_FILE, '[]');
    }
    try {
      await fs.access(BUDGETS_FILE);
    } catch {
      await fs.writeFile(BUDGETS_FILE, '[]');
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

// Read users from JSON file
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

// Write users to JSON file
async function writeUsers(users) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users:', error);
    throw error;
  }
}

// Read budgets from JSON file
async function readBudgets() {
  try {
    const data = await fs.readFile(BUDGETS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading budgets:', error);
    return [];
  }
}

// Write budgets to JSON file
async function writeBudgets(budgets) {
  try {
    await fs.writeFile(BUDGETS_FILE, JSON.stringify(budgets, null, 2));
  } catch (error) {
    console.error('Error writing budgets:', error);
    throw error;
  }
}

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// POST /auth/register - Register a new user
app.post('/auth/register', async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const users = await readUsers();
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      fullName,
      email,
      password: hashedPassword,
      createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    users.push(newUser);
    await writeUsers(users);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, fullName: newUser.fullName }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /auth/login - Login user
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = await readUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, fullName: user.fullName }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// GET /auth/me - Get current user
app.get('/auth/me', authenticateToken, async (req, res) => {
  try {
    const users = await readUsers();
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// GET /expenses - Get all expenses
app.get('/expenses', authenticateToken, async (req, res) => {
  try {
    const expenses = await readExpenses();
    const userExpenses = expenses.filter(exp => exp.userId === req.user.id);
    res.json(userExpenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read expenses' });
  }
});

// POST /expenses - Create a new expense
app.post('/expenses', authenticateToken, async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    
    if (!amount || !category || !date) {
      return res.status(400).json({ error: 'Amount, category, and date are required' });
    }

    const expenses = await readExpenses();
    const newExpense = {
      id: uuidv4(),
      userId: req.user.id,
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
app.put('/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, date, note } = req.body;

    const expenses = await readExpenses();
    const index = expenses.findIndex(exp => exp.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (expenses[index].userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
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
app.delete('/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const expenses = await readExpenses();
    const expense = expenses.find(exp => exp.id === id);

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    if (expense.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const filteredExpenses = expenses.filter(exp => exp.id !== id);
    await writeExpenses(filteredExpenses);
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

// GET /budgets - Get all budgets for current user
app.get('/budgets', authenticateToken, async (req, res) => {
  try {
    const budgets = await readBudgets();
    const userBudgets = budgets.filter(budget => budget.userId === req.user.id);
    res.json(userBudgets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read budgets' });
  }
});

// POST /budgets - Create a new budget
app.post('/budgets', authenticateToken, async (req, res) => {
  try {
    const { category, monthlyBudget } = req.body;

    if (!category || !monthlyBudget) {
      return res.status(400).json({ error: 'Category and monthly budget are required' });
    }

    const validCategories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    if (isNaN(monthlyBudget) || monthlyBudget <= 0) {
      return res.status(400).json({ error: 'Monthly budget must be a positive number' });
    }

    const budgets = await readBudgets();
    const existingBudget = budgets.find(
      budget => budget.userId === req.user.id && budget.category === category
    );

    if (existingBudget) {
      return res.status(400).json({ error: 'Budget already exists for this category' });
    }

    const newBudget = {
      id: uuidv4(),
      userId: req.user.id,
      category,
      monthlyBudget: parseFloat(monthlyBudget),
      createdAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      updatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    budgets.push(newBudget);
    await writeBudgets(budgets);

    res.status(201).json(newBudget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create budget' });
  }
});

// PUT /budgets/:id - Update a budget
app.put('/budgets/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, monthlyBudget } = req.body;

    const budgets = await readBudgets();
    const index = budgets.findIndex(budget => budget.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    if (budgets[index].userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (category) {
      const validCategories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ error: 'Invalid category' });
      }

      // Check if category is already used by another budget
      const existingBudget = budgets.find(
        budget => budget.userId === req.user.id && budget.category === category && budget.id !== id
      );
      if (existingBudget) {
        return res.status(400).json({ error: 'Budget already exists for this category' });
      }
    }

    if (monthlyBudget !== undefined) {
      if (isNaN(monthlyBudget) || monthlyBudget <= 0) {
        return res.status(400).json({ error: 'Monthly budget must be a positive number' });
      }
    }

    budgets[index] = {
      ...budgets[index],
      category: category || budgets[index].category,
      monthlyBudget: monthlyBudget !== undefined ? parseFloat(monthlyBudget) : budgets[index].monthlyBudget,
      updatedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    await writeBudgets(budgets);
    res.json(budgets[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// DELETE /budgets/:id - Delete a budget
app.delete('/budgets/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const budgets = await readBudgets();
    const budget = budgets.find(budget => budget.id === id);

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    if (budget.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const filteredBudgets = budgets.filter(budget => budget.id !== id);
    await writeBudgets(filteredBudgets);
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

// Analytics Endpoints

// GET /analytics/summary - Get financial insights summary
app.get('/analytics/summary', authenticateToken, async (req, res) => {
  try {
    const expenses = await readExpenses();
    const userExpenses = expenses.filter(exp => exp.userId === req.user.id);

    if (userExpenses.length === 0) {
      return res.json({
        totalExpenses: 0,
        averageExpenseAmount: 0,
        highestSingleExpense: 0,
        lowestExpense: 0,
        mostUsedCategory: 'N/A',
        currentMonthSpending: 0,
        previousMonthSpending: 0
      });
    }

    const totalExpenses = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const averageExpenseAmount = totalExpenses / userExpenses.length;
    const highestSingleExpense = Math.max(...userExpenses.map(exp => exp.amount));
    const lowestExpense = Math.min(...userExpenses.map(exp => exp.amount));

    const categoryCount = {};
    userExpenses.forEach(exp => {
      categoryCount[exp.category] = (categoryCount[exp.category] || 0) + 1;
    });
    const mostUsedCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0][0];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthExpenses = userExpenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });
    const currentMonthSpending = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const previousMonthExpenses = userExpenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === previousMonth && expDate.getFullYear() === previousMonthYear;
    });
    const previousMonthSpending = previousMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.json({
      totalExpenses,
      averageExpenseAmount: parseFloat(averageExpenseAmount.toFixed(2)),
      highestSingleExpense,
      lowestExpense,
      mostUsedCategory,
      currentMonthSpending,
      previousMonthSpending
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({ error: 'Failed to get analytics summary' });
  }
});

// GET /analytics/monthly-trends - Get monthly spending trends for last 12 months
app.get('/analytics/monthly-trends', authenticateToken, async (req, res) => {
  try {
    const expenses = await readExpenses();
    const userExpenses = expenses.filter(exp => exp.userId === req.user.id);

    const months = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      
      const monthExpenses = userExpenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === month && expDate.getFullYear() === year;
      });
      
      const totalSpending = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      months.push({
        month: date.toLocaleString('default', { month: 'short', year: '2-digit' }),
        totalSpending
      });
    }

    res.json(months);
  } catch (error) {
    console.error('Monthly trends error:', error);
    res.status(500).json({ error: 'Failed to get monthly trends' });
  }
});

// GET /analytics/category-breakdown - Get category spending breakdown
app.get('/analytics/category-breakdown', authenticateToken, async (req, res) => {
  try {
    const expenses = await readExpenses();
    const userExpenses = expenses.filter(exp => exp.userId === req.user.id);

    if (userExpenses.length === 0) {
      return res.json([]);
    }

    const categorySpending = {};
    userExpenses.forEach(exp => {
      if (!categorySpending[exp.category]) {
        categorySpending[exp.category] = 0;
      }
      categorySpending[exp.category] += exp.amount;
    });

    const totalSpending = Object.values(categorySpending).reduce((sum, amount) => sum + amount, 0);

    const breakdown = Object.entries(categorySpending).map(([category, amount]) => ({
      category,
      amount,
      percentage: parseFloat(((amount / totalSpending) * 100).toFixed(2))
    })).sort((a, b) => b.amount - a.amount);

    res.json(breakdown);
  } catch (error) {
    console.error('Category breakdown error:', error);
    res.status(500).json({ error: 'Failed to get category breakdown' });
  }
});

// GET /analytics/daily-spending - Get daily spending pattern for current month
app.get('/analytics/daily-spending', authenticateToken, async (req, res) => {
  try {
    const expenses = await readExpenses();
    const userExpenses = expenses.filter(exp => exp.userId === req.user.id);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthExpenses = userExpenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });

    const dailySpending = {};
    currentMonthExpenses.forEach(exp => {
      const expDate = new Date(exp.date);
      const day = expDate.getDate();
      if (!dailySpending[day]) {
        dailySpending[day] = 0;
      }
      dailySpending[day] += exp.amount;
    });

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dailyData = [];

    for (let day = 1; day <= daysInMonth; day++) {
      dailyData.push({
        day: `Day ${day}`,
        amount: dailySpending[day] || 0
      });
    }

    const highestSpendingDay = dailyData.reduce((max, day) => 
      day.amount > max.amount ? day : max, { day: 'N/A', amount: 0 });

    const averageDailySpending = currentMonthExpenses.length > 0 
      ? currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0) / daysInMonth 
      : 0;

    res.json({
      dailyData,
      highestSpendingDay,
      averageDailySpending: parseFloat(averageDailySpending.toFixed(2))
    });
  } catch (error) {
    console.error('Daily spending error:', error);
    res.status(500).json({ error: 'Failed to get daily spending' });
  }
});

// Initialize and start server
initDataFile().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
