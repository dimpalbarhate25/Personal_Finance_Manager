import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Trash2, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const TransactionManager = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      purpose: 'Lunch at Italian Restaurant',
      category: 'Food & Dining',
      amount: -45.99,
      date: '2025-06-17',
      type: 'expense'
    },
    {
      id: 2,
      purpose: 'Monthly Salary',
      category: 'Salary',
      amount: 3200.00,
      date: '2025-06-17',
      type: 'income'
    },
    {
      id: 3,
      purpose: 'Gas Station Fill-up',
      category: 'Transportation',
      amount: -89.50,
      date: '2025-06-17',
      type: 'expense'
    },
    {
      id: 4,
      purpose: 'abc',
      category: 'Food & Drinks',
      amount: -100,
      date: '2025-06-17',
      type: 'expense'
    },
    {
      id: 5,
      purpose: '123',
      category: 'Shopping',
      amount: -1232333,
      date: '2025-06-14',
      type: 'expense'
    },
    {
      id: 6,
      purpose: 'salary',
      category: 'Income',
      amount: 1000,
      date: '2025-06-17',
      type: 'income'
    },
    {
      id: 7,
      purpose: 'salry',
      category: 'Income',
      amount: 10000,
      date: '2025-06-17',
      type: 'income'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [selectedMonth, setSelectedMonth] = useState('June, 2025');
  
  const [formData, setFormData] = useState({
    type: 'income',
    amount: '',
    category: '',
    date: '2025-06-17',
    purpose: ''
  });

  const incomeCategories = ['Salary', 'Freelance', 'Investment'];
  const expenseCategories = ['Food & Dining', 'Transportation', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTransaction = () => {
    if (!formData.amount || !formData.category || !formData.purpose) return;

    const newTransaction = {
      id: Date.now(),
      purpose: formData.purpose,
      category: formData.category,
      amount: formData.type === 'expense' ? -Math.abs(parseFloat(formData.amount)) : Math.abs(parseFloat(formData.amount)),
      date: formData.date,
      type: formData.type
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setFormData({
      type: 'income',
      amount: '',
      category: '',
      date: '2025-06-17',
      purpose: ''
    });
    setIsModalOpen(false);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = transaction.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'All Types' || 
                          (filterType === 'Income' && transaction.amount > 0) ||
                          (filterType === 'Expense' && transaction.amount < 0);
      return matchesSearch && matchesFilter;
    });
  }, [transactions, searchTerm, filterType]);

  const chartData = useMemo(() => {
    const dailyData = {};
    transactions.forEach(transaction => {
      const date = transaction.date;
      if (!dailyData[date]) {
        dailyData[date] = { date, income: 0, expense: 0, net: 0 };
      }
      if (transaction.amount > 0) {
        dailyData[date].income += transaction.amount;
      } else {
        dailyData[date].expense += Math.abs(transaction.amount);
      }
      dailyData[date].net += transaction.amount;
    });
    
    return Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Food & Dining': '🍽️',
      'Transportation': '🚗',
      'Shopping': '🛍️',
      'Salary': '💰',
      'Freelance': '💼',
      'Investment': '📈',
      'Income': '💰',
      'Entertainment': '🎬',
      'Bills & Utilities': '💡',
      'Healthcare': '🏥',
      'Education': '📚',
      'Food & Drinks': '🍽️'
    };
    return iconMap[category] || '💳';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-1">Track and manage all your financial transactions</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Transaction
          </button>
        </div>

        {/* Month Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter by month:</span>
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option>June, 2025</option>
              <option>May, 2025</option>
              <option>April, 2025</option>
            </select>
            <Calendar size={16} className="text-gray-500" />
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  `$${Math.abs(value).toLocaleString()}`,
                  name === 'expense' ? 'Expense' : name === 'income' ? 'Income' : 'Net'
                ]}
              />
              <Bar dataKey="income" fill="#10b981" />
              <Bar dataKey="expense" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option>All Types</option>
              <option>Income</option>
              <option>Expense</option>
            </select>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-lg shadow-sm">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No transactions found
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                      transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{transaction.purpose}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{transaction.category}</span>
                        <span>{new Date(transaction.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add Transaction</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleInputChange('type', 'expense')}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                      formData.type === 'expense'
                        ? 'bg-red-100 border-red-300 text-red-700'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    onClick={() => handleInputChange('type', 'income')}
                    className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                      formData.type === 'income'
                        ? 'bg-green-100 border-green-300 text-green-700'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1000"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                <input
                  type="text"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter purpose"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {(formData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTransaction}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManager;