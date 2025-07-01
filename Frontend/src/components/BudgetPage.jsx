import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BudgetPage({ transactions, categories, settings }) {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [categoryBudgets, setCategoryBudgets] = useState([]);
  const [newBudget, setNewBudget] = useState({ category: "", amount: "" });

  const STATIC_CATEGORIES = [
    "Shopping",
    "Food & Drinks",
    "Bills & Utilities",
    "Others",
  ];

  const allCategoryNames = useMemo(() => {
    const dynamic = categories.map((c) => c.name);
    const combined = [...new Set([...STATIC_CATEGORIES, ...dynamic])];
    return combined;
  }, [categories]);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5002/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        const mapped = allCategoryNames.map((name) => {
          const found = data.find((d) => d.name === name);
          return {
            category: name,
            amount: found?.budgetLimit || 1000,
            _id: found?._id || null,
          };
        });

        setCategoryBudgets(mapped);
      } catch (err) {
        console.error("Failed to fetch category budgets", err);
      }
    };

    fetchBudgets();
  }, [categories]);

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
    (sum, tx) => sum + Math.abs(tx.amount || tx.sum || 0),
    0
  );

  const categorySpending = useMemo(() => {
    const result = {};
    currentMonthExpenses.forEach((tx) => {
      result[tx.category] = (result[tx.category] || 0) + Math.abs(tx.amount || tx.sum || 0);
    });
    return result;
  }, [currentMonthExpenses]);

  const handleAddCategoryBudget = async () => {
    const { category, amount } = newBudget;
    if (!category || !amount) return;

    const existing = categoryBudgets.find((b) => b.category === category);
    const parsedAmount = parseFloat(amount);

    if (existing?._id) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5002/api/categories/${existing._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ budgetLimit: parsedAmount }),
        });
        const updated = await res.json();

        setCategoryBudgets((prev) =>
          prev.map((b) =>
            b.category === category ? { ...b, amount: updated.budgetLimit } : b
          )
        );
      } catch (err) {
        console.error("Error updating budget", err);
      }
    } else {
      setCategoryBudgets((prev) => [
        ...prev,
        { category, amount: parsedAmount, _id: null },
      ]);
    }

    setNewBudget({ category: "", amount: "" });
  };

  const progressColor = (spent, limit) => {
    const ratio = spent / limit;
    if (ratio > 1) return "bg-red-500";
    if (ratio > 0.9) return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-3 text-gray-700">
        <ArrowLeft className="cursor-pointer hover:text-fuchsia-800" onClick={() => navigate("/")} />
        <h2 className="text-3xl font-bold">Budget Overview</h2>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <label className="font-semibold text-gray-700">Select Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
        >
          {[2023, 2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Budget Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border">
          <label className="font-semibold text-gray-700">Monthly Budget</label>
          <input
            type="number"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(parseFloat(e.target.value))}
            className="w-full border mt-2 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-sm text-gray-600">Total Spent</p>
          <p className="text-2xl font-bold text-red-600">{settings.currency}{totalSpent.toFixed(2)}</p>
          <p className="text-sm mt-2 text-gray-600">Remaining</p>
          <p className="text-xl font-semibold text-green-600">
            {settings.currency}{Math.max(0, (monthlyBudget - totalSpent).toFixed(2))}
          </p>
          <div className="bg-gray-200 w-full h-3 rounded mt-4">
            <div
              className="h-3 rounded"
              style={{
                width: `${(totalSpent / monthlyBudget) * 100}%`,
                backgroundColor: totalSpent > monthlyBudget ? "#dc2626" : "#10b981",
              }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                dataKey="value"
                data={[
                  { name: "Spent", value: totalSpent },
                  { name: "Remaining", value: Math.max(0, monthlyBudget - totalSpent) },
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

      {/* Add/Update Category Budget */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage Category Budgets</h3>
        <div className="bg-white p-4 rounded-lg shadow border flex flex-wrap gap-3 items-center">
          <select
            value={newBudget.category}
            onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="">Select Category</option>
            {allCategoryNames.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Enter Amount"
            value={newBudget.amount}
            onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
            className="border px-4 py-2 rounded-lg"
          />
          <button
            onClick={handleAddCategoryBudget}
            className="bg-fuchsia-800 hover:bg-fuchsia-700 text-white px-6 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>

      {/* Category Budget Progress */}
      <div className="space-y-6">
        {categoryBudgets.map((budget) => {
          const spent = categorySpending[budget.category] || 0;
          const percentage = (spent / budget.amount) * 100;
          return (
            <div key={budget.category} className="bg-white p-4 rounded-lg shadow border">
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700">{budget.category}</span>
                <span className="text-sm text-gray-600">
                  {settings.currency}{spent.toFixed(2)} / {settings.currency}{budget.amount}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded">
                <div
                  className={`h-3 rounded ${progressColor(spent, budget.amount)}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
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
