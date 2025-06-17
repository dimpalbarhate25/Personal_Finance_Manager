// pages/TransactionPage.jsx
import React, { useState, useMemo } from "react";
import { Trash2, Plus } from "lucide-react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function TransactionPage({
  transactions,
  addTransaction,
  deleteTransaction,
  updateBalanceAndCategories,
    categories
}) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showForm, setShowForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    purpose: "",
    category: "Food & Drinks",
    sum: "",
    date: new Date().toISOString().slice(0, 10),
    type: "expense"
  });

  const filteredTransactions = useMemo(() =>
    transactions.filter(t => t.date.startsWith(selectedMonth)), [transactions, selectedMonth]);

  const chartData = useMemo(() => {
  const grouped = {};
  filteredTransactions.forEach(tx => {
    grouped[tx.date] = (grouped[tx.date] || 0) + tx.sum;
  });
  return Object.entries(grouped).map(([date, sum]) => ({ date, sum }));
}, [filteredTransactions]);


  const handleAdd = () => {
    const { purpose, category, sum, date, type } = newTransaction;
    if (!purpose || !sum || !date) return alert("Fill all fields");
    const transaction = {
  id: Date.now(),
  purpose,
  category,
  sum: type === "expense" ? -parseFloat(sum) : parseFloat(sum),
  date,
  type
};

addTransaction(transaction);
updateBalanceAndCategories(transaction); // ✅ updates boxes too

    setShowForm(false);
    setNewTransaction({ ...newTransaction, purpose: "", sum: "" });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Transactions</h2>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter by month:</label>
        <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="border rounded px-2 py-1" />
      </div>

      {chartData.length > 0 && (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="sum">
        {chartData.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={entry.sum < 0 ? "#ef4444" : "#10b981"}
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
)}


      <table className="w-full mt-6 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Purpose</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((t) => (
            <tr key={t.id} className="border-b">
              <td className="p-2">{t.purpose}</td>
              <td>{t.category}</td>
              <td className={t.sum < 0 ? "text-red-600" : "text-green-600"}>
                {t.sum < 0 ? "-" : "+"} ₹{Math.abs(t.sum)}
              </td>
              <td>{t.date}</td>
              <td>
                <button onClick={() => deleteTransaction(t.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowForm(true)} className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700">
        <Plus />
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-full max-w-md space-y-3">
            <h3 className="text-xl font-bold">Add Transaction</h3>
            <input type="text" placeholder="Purpose" className="input w-full" value={newTransaction.purpose}
              onChange={(e) => setNewTransaction({ ...newTransaction, purpose: e.target.value })} />
            <input type="number" placeholder="Amount" className="input w-full" value={newTransaction.sum}
              onChange={(e) => setNewTransaction({ ...newTransaction, sum: e.target.value })} />
            <input type="date" className="input w-full" value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })} />
           <select
  value={newTransaction.category}
  className="input w-full"
  onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
>
  {categories.map((cat) => (
    <option key={cat.name} value={cat.name}>
      {cat.name}
    </option>
  ))}
</select>

            <select value={newTransaction.type} className="input w-full"
              onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 text-white rounded">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
