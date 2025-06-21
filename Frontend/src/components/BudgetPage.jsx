// BudgetPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BudgetPage({ transactions, categories,settings  }) {
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ category: "", amount: "" });

  // Load budget from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`budget-${selectedYear}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setMonthlyBudget(parsed.total);
      setCategoryBudgets(parsed.categories);
    }
  }, [selectedYear]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      `budget-${selectedYear}`,
      JSON.stringify({ total: monthlyBudget, categories: categoryBudgets })
    );
  }, [monthlyBudget, categoryBudgets, selectedYear]);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const currentMonthExpenses = useMemo(
    () =>
      transactions.filter(
        (tx) =>
          tx.type === "expense" &&
          tx.date.startsWith(currentMonth) &&
          tx.date.startsWith(`${selectedYear}-`)
      ),
    [transactions, selectedYear, currentMonth]
  );

  const totalSpent = currentMonthExpenses.reduce(
    (sum, tx) => sum + Math.abs(tx.sum),
    0
  );

  const remaining = Math.max(0, monthlyBudget - totalSpent);

  const categorySpending = useMemo(() => {
    const result = {};
    currentMonthExpenses.forEach((tx) => {
      result[tx.category] = (result[tx.category] || 0) + Math.abs(tx.sum);
    });
    return result;
  }, [currentMonthExpenses]);

  const handleAddCategoryBudget = () => {
    if (!newBudget.category || !newBudget.amount) return;
    const exists = categoryBudgets.find((b) => b.category === newBudget.category);
    if (exists) {
      setCategoryBudgets((prev) =>
        prev.map((b) =>
          b.category === newBudget.category
            ? { ...b, amount: parseFloat(newBudget.amount) }
            : b
        )
      );
    } else {
      setCategoryBudgets((prev) => [
        ...prev,
        { category: newBudget.category, amount: parseFloat(newBudget.amount) },
      ]);
    }
    setNewBudget({ category: "", amount: "" });
  };

  const progressColor = (spent, limit) => {
    const ratio = spent / limit;
    if (ratio > 1) return "bg-red-500";
    if (ratio > 0.9) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
  <div className="p-6 space-y-8">
    <div className="flex items-center gap-3 text-gray-700">
      <ArrowLeft
        className="cursor-pointer hover:text-fuchsia-800"
        onClick={() => navigate("/")}
      />
      <h2 className="text-3xl font-bold">Budget Overview</h2>
    </div>

    {/* Year Selector */}
    <div className="flex flex-wrap gap-4 items-center">
      <label className="font-semibold text-gray-700">Select Year:</label>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
        className="border px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
      >
        {[2023, 2024, 2025].map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>

    {/* Budget Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <label className="font-semibold text-gray-700">Monthly Budget</label>
        <input
          type="number"
          value={monthlyBudget}
          onChange={(e) => setMonthlyBudget(parseFloat(e.target.value))}
          className="w-full border mt-2 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <p className="text-sm text-gray-600 mb-1">Total Spent</p>
        <p className="text-2xl font-semibold text-red-600 mb-2">{settings.currency}
{totalSpent.toFixed(2)}</p>
        <p className="text-sm text-gray-600 mb-1">Remaining</p>
        <p className="text-xl font-medium text-green-600">{settings.currency}{remaining.toFixed(2)}</p>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
          <div
            className="h-3 rounded-full"
            style={{
              width: `${(totalSpent / monthlyBudget) * 100}%`,
              backgroundColor:
                totalSpent > monthlyBudget
                  ? "#ef4444"
                  : totalSpent > monthlyBudget * 0.9
                  ? "#facc15"
                  : "#10b981",
            }}
          ></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg border">
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie
              dataKey="value"
              data={[
                { name: "Spent", value: totalSpent },
                { name: "Remaining", value: remaining },
              ]}
              cx="50%"
              cy="50%"
              outerRadius={50}
              label
            >
              <Cell fill="#ef4444" />
              <Cell fill="#10b981" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Category Budget Input */}
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-3">Manage Category Budgets</h3>
      <div className="flex flex-wrap gap-4 items-end bg-white p-6 rounded-lg shadow border">
        <select
          value={newBudget.category}
          onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
          className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Enter Budget Amount"
          value={newBudget.amount}
          onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
          className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
        />
        <button
          onClick={handleAddCategoryBudget}
          className="bg-fuchsia-800 hover:bg-fuchsia-700 text-white px-6 py-2 rounded-lg shadow"
        >
          Save
        </button>
      </div>
    </div>

    {/* Category Budget Progress */}
    <div className="space-y-6">
      {categoryBudgets.map((budget) => {
        const spent = categorySpending[budget.category] || 0;
        return (
          <div key={budget.category} className="bg-white p-5 rounded-xl shadow border">
            <p className="font-medium text-gray-700 mb-1">
              {budget.category}: {settings.currency}{spent.toFixed(2)} / €{budget.amount}
            </p>
            <div className="w-full bg-gray-200 h-4 rounded">
              <div
                className={`h-4 rounded ${progressColor(spent, budget.amount)}`}
                style={{ width: `${(spent / budget.amount) * 100}%` }}
              ></div>
            </div>
            {spent > budget.amount && (
              <p className="text-sm text-red-600 mt-1">
                ⚠ You've exceeded this budget by {settings.currency}{(spent - budget.amount).toFixed(2)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

}
