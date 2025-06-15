import React, { useState } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Utensils, 
  Home, 
  Leaf, 
  Plus, 
  Settings, 
  PieChart as PieChartIcon, // ✅ renamed to avoid conflict
  BarChart3,
  TrendingUp,
  CreditCard,
  Wallet,
  Building2,
  Trash2,
  Edit3
} from 'lucide-react';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';


const FinancialDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [balance, setBalance] = useState(3325.90);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([
    { id: 1, name: 'Checking Account', balance: 2500.00, type: 'checking', icon: CreditCard },
    { id: 2, name: 'Savings Account', balance: 825.90, type: 'savings', icon: Wallet },
    { id: 3, name: 'Investment Account', balance: 1250.00, type: 'investment', icon: Building2 }
  ]);
  
  const [categories, setCategories] = useState([
    { name: 'Shopping', amount: 0, color: 'bg-cyan-500', icon: ShoppingCart },
    { name: 'Food & Drinks', amount: 0, color: 'bg-amber-500', icon: Utensils },
    { name: 'Bills & Utilities', amount: 0, color: 'bg-red-500', icon: Home },
    { name: 'Others', amount: 0, color: 'bg-gray-800', icon: Leaf }
  ]);

  const [newExpense, setNewExpense] = useState({
    purpose: '',
    sum: '',
    date: '',
    category: 'Food & Drinks'
  });

  const [newCash, setNewCash] = useState({
    amount: '',
    account: 'Checking Account',
    description: ''
  });

  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'checking',
    initialBalance: ''
  });

  const [settings, setSettings] = useState({
    currency: 'EUR',
    budgetLimit: 1000,
    notifications: true,
    darkMode: false
  });

  // Handle adding expense
  const handleAddExpense = () => {
    if (!newExpense.purpose || !newExpense.sum || !newExpense.date) {
      alert('Please fill in all fields');
      return;
    }

    const amount = parseFloat(newExpense.sum);
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Create new transaction
    const transaction = {
      id: Date.now(),
      purpose: newExpense.purpose,
      category: newExpense.category,
      sum: -amount,
      date: newExpense.date,
      type: 'expense'
    };

    // Add transaction
    setTransactions(prev => [transaction, ...prev]);

    // Update balance
    setBalance(prev => prev - amount);

    // Update category amount
    setCategories(prev => prev.map(cat => 
      cat.name === newExpense.category 
        ? { ...cat, amount: cat.amount + amount }
        : cat
    ));

    // Reset form
    setNewExpense({
      purpose: '',
      sum: '',
      date: '',
      category: 'Food & Drinks'
    });

    alert('Expense added successfully!');
  };

  // Handle adding cash
  const handleAddCash = () => {
    if (!newCash.amount || !newCash.account) {
      alert('Please fill in all fields');
      return;
    }

    const amount = parseFloat(newCash.amount);
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Create income transaction
    const transaction = {
      id: Date.now(),
      purpose: newCash.description || `Added to ${newCash.account}`,
      category: 'Income',
      sum: amount,
      date: new Date().toISOString().split('T')[0],
      type: 'income'
    };

    // Add transaction
    setTransactions(prev => [transaction, ...prev]);

    // Update balance
    setBalance(prev => prev + amount);

    // Update account balance
    setAccounts(prev => prev.map(acc => 
      acc.name === newCash.account 
        ? { ...acc, balance: acc.balance + amount }
        : acc
    ));

    // Reset form
    setNewCash({
      amount: '',
      account: 'Checking Account',
      description: ''
    });

    alert('Cash added successfully!');
  };

  // Handle adding new account
  const handleAddAccount = () => {
    if (!newAccount.name || !newAccount.initialBalance) {
      alert('Please fill in all fields');
      return;
    }

    const balance = parseFloat(newAccount.initialBalance);
    if (balance < 0) {
      alert('Please enter a valid initial balance');
      return;
    }

    const account = {
      id: Date.now(),
      name: newAccount.name,
      balance: balance,
      type: newAccount.type,
      icon: newAccount.type === 'checking' ? CreditCard : newAccount.type === 'savings' ? Wallet : Building2
    };

    setAccounts(prev => [...prev, account]);

    // Add initial balance as income transaction
    if (balance > 0) {
      const transaction = {
        id: Date.now() + 1,
        purpose: `Initial balance for ${newAccount.name}`,
        category: 'Income',
        sum: balance,
        date: new Date().toISOString().split('T')[0],
        type: 'income'
      };
      setTransactions(prev => [transaction, ...prev]);
      setBalance(prev => prev + balance);
    }

    // Reset form
    setNewAccount({
      name: '',
      type: 'checking',
      initialBalance: ''
    });

    alert('Account added successfully!');
  };

  // Handle deleting account
  const handleDeleteAccount = (accountId) => {
    if (accounts.length <= 1) {
      alert('You must have at least one account');
      return;
    }

    const account = accounts.find(acc => acc.id === accountId);
    if (account && account.balance > 0) {
      if (!window.confirm(`This account has a balance of ${account.balance.toFixed(2)}. Are you sure you want to delete it?`)) {
        return;
      }
      // Deduct balance from total
      setBalance(prev => prev - account.balance);
    }

    setAccounts(prev => prev.filter(acc => acc.id !== accountId));
  };

  // Handle updating settings
  const handleUpdateSettings = () => {
    alert('Settings updated successfully!');
  };

  // Delete transaction
  const handleDeleteTransaction = (transactionId) => {
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    // Update balance
    setBalance(prev => prev - transaction.sum);

    // Update category if it's an expense
    if (transaction.type === 'expense') {
      setCategories(prev => prev.map(cat => 
        cat.name === transaction.category 
          ? { ...cat, amount: Math.max(0, cat.amount + transaction.sum) }
          : cat
      ));
    }

    // Remove transaction
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
  };

  // Chart data
  const pieData = categories.filter(cat => cat.amount > 0).map(cat => ({
    name: cat.name,
    value: cat.amount
  }));

  const monthlyData = [
    { month: 'Jan', income: 2000, expenses: 1500 },
    { month: 'Feb', income: 2200, expenses: 1800 },
    { month: 'Mar', income: 2100, expenses: 1600 },
    { month: 'Apr', income: 2300, expenses: 1900 },
    { month: 'May', income: 2150, expenses: 1700 },
    { month: 'Jun', income: 2400, expenses: 2000 },
    { month: 'Jul', income: 2500, expenses: categories.reduce((sum, cat) => sum + cat.amount, 0) }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'Income': 'bg-green-500',
      'Food & Drinks': 'bg-amber-500',
      'Others': 'bg-gray-500',
      'Bills & Utilities': 'bg-red-500',
      'Shopping': 'bg-cyan-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const MenuItem = ({ icon: Icon, label, isActive, onClick }) => (
    <div
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
        isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
      }`}
      onClick={onClick}
    >
      <Icon size={20} />
      <span>{label}</span>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold">H</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">humble</h2>
            <p className="text-sm text-gray-400">Hello, paskozhelev</p>
            <p className="text-xs text-gray-500">Administrator • Online</p>
          </div>
        </div>

        <nav className="space-y-2">
          <MenuItem 
            icon={BarChart3} 
            label="Dashboard" 
            isActive={activeTab === 'Dashboard'}
            onClick={() => setActiveTab('Dashboard')}
          />
          <MenuItem 
            icon={Plus} 
            label="Add Cash" 
            isActive={activeTab === 'AddCash'}
            onClick={() => setActiveTab('AddCash')}
          />
          <MenuItem 
            icon={CreditCard} 
            label="Accounts" 
            isActive={activeTab === 'Accounts'}
            onClick={() => setActiveTab('Accounts')}
          />
          <MenuItem 
            icon={Settings} 
            label="Settings" 
            isActive={activeTab === 'Settings'}
            onClick={() => setActiveTab('Settings')}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'Dashboard' && (
          <div className="p-6">
            {/* Balance and Category Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {/* Balance Card */}
              <div className="lg:col-span-2 bg-green-500 text-white p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm opacity-90">Balance</span>
                  <DollarSign size={24} />
                </div>
                <div className="text-3xl font-bold">{settings.currency} {balance.toFixed(2)}</div>
              </div>

              {/* Category Cards */}
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <div key={index} className={`${category.color} text-white p-6 rounded-lg`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm opacity-90">{category.name}</span>
                      <Icon size={24} />
                    </div>
                    <div className="text-xl font-bold">{settings.currency} {category.amount.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Pie Chart */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Expense Distribution</h3>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#06b6d4', '#f59e0b', '#ef4444', '#374151'][index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-300 flex items-center justify-center text-gray-500">
                    No expenses to display
                  </div>
                )}
              </div>

              {/* Bar Chart */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" name="Income" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Transactions and Add Expense */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Transactions */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                  {transactions.length > 0 ? (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sum</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.purpose}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getCategoryColor(transaction.category)}`}>
                                {transaction.category}
                              </span>
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.type === 'income' ? '+' : ''}{transaction.sum.toFixed(2)} {settings.currency}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => handleDeleteTransaction(transaction.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <p>No transactions yet. Add your first expense or income!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Expenditure */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b bg-red-500 text-white rounded-t-lg">
                  <h3 className="text-lg font-semibold">Add Expenditure</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                    <input
                      type="text"
                      value={newExpense.purpose}
                      onChange={(e) => setNewExpense({...newExpense, purpose: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter purpose"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sum</label>
                    <input
                      type="number"
                      value={newExpense.sum}
                      onChange={(e) => setNewExpense({...newExpense, sum: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat.name}
                          type="button"
                          onClick={() => setNewExpense({...newExpense, category: cat.name})}
                          className={`p-2 rounded-lg border text-sm ${
                            newExpense.category === cat.name 
                              ? 'border-red-500 bg-red-50 text-red-700' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <cat.icon size={16} className="mx-auto mb-1" />
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleAddExpense}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Bars Section */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-6">Budget Progress</h3>
              <div className="space-y-4">
                {categories.map((category, index) => {
                  const budget = settings.budgetLimit / categories.length;
                  const percentage = Math.min((category.amount / budget) * 100, 100);
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{category.name}</span>
                        <span className="text-sm text-gray-500">
                          {settings.currency} {category.amount.toFixed(2)} / {settings.currency} {budget.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            percentage > 80 ? 'bg-red-500' : percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">{percentage.toFixed(1)}% of budget used</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'AddCash' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Add Cash</h2>
            <div className="bg-white rounded-lg shadow p-6 max-w-md">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    value={newCash.amount}
                    onChange={(e) => setNewCash({...newCash, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account</label>
                  <select 
                    value={newCash.account}
                    onChange={(e) => setNewCash({...newCash, account: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {accounts.map(account => (
                      <option key={account.id} value={account.name}>{account.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                  <input
                    type="text"
                    value={newCash.description}
                    onChange={(e) => setNewCash({...newCash, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter description"
                  />
                </div>
                <button
                  onClick={handleAddCash}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Cash
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Accounts' && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Accounts</h2>
              <div className="text-lg font-semibold text-green-600">
                Total: {settings.currency} {accounts.reduce((sum, acc) => sum + acc.balance, 0).toFixed(2)}
              </div>
            </div>
            
            {/* Existing Accounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {accounts.map((account) => {
                const Icon = account.icon;
                return (
                  <div key={account.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Icon size={24} className="text-gray-600" />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteAccount(account.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{account.name}</h3>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {settings.currency} {account.balance.toFixed(2)}
                    </div>
                    <span className="text-sm text-gray-500 capitalize">{account.type} Account</span>
                  </div>
                );
              })}
            </div>

            {/* Add New Account */}
            <div className="bg-white rounded-lg shadow p-6 max-w-md">
              <h3 className="text-lg font-semibold mb-4">Add New Account</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                  <input
                    type="text"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter account name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                  <select 
                    value={newAccount.type}
                    onChange={(e) => setNewAccount({...newAccount, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Initial Balance</label>
                  <input
                    type="number"
                    value={newAccount.initialBalance}
                    onChange={(e) => setNewAccount({...newAccount, initialBalance: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter initial balance"
                  />
                </div>
                <button
                  onClick={handleAddAccount}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Account
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Settings' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="bg-white rounded-lg shadow p-6 max-w-md">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select 
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Budget Limit</label>
                  <input
                    type="number"
                    value={settings.budgetLimit}
                    onChange={(e) => setSettings({...settings, budgetLimit: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter budget limit"
                  />
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.notifications}
                      onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Enable Notifications</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.darkMode}
                      onChange={(e) => setSettings({...settings, darkMode: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Dark Mode</span>
                  </label>
                </div>
                
                <button
                  onClick={handleUpdateSettings}
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Update Settings
                </button>
              </div>
            </div>

            {/* Settings Summary */}
            <div className="mt-6 bg-white rounded-lg shadow p-6 max-w-md">
              <h3 className="text-lg font-semibold mb-4">Current Settings</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Currency:</span>
                  <span className="font-medium">{settings.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Budget Limit:</span>
                  <span className="font-medium">{settings.currency} {settings.budgetLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Notifications:</span>
                  <span className={`font-medium ${settings.notifications ? 'text-green-600' : 'text-red-600'}`}>
                    {settings.notifications ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dark Mode:</span>
                  <span className={`font-medium ${settings.darkMode ? 'text-green-600' : 'text-red-600'}`}>
                    {settings.darkMode ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialDashboard;