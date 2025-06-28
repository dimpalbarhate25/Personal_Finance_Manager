import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FinancialDashboard from "./components/Dashboard";
import Signup from "./components/Signup";
import Login from "./components/Login";
import BudgetPage from "./components/BudgetPage";
import TransactionPage from "./components/TransactionPage";
import { useAuth } from "./context/AuthProvider";
import { ShoppingCart, Utensils, Home, Leaf } from "lucide-react";
import axios from "axios";

function App() {
  const [authUser] = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0.0);
  const [categories, setCategories] = useState([
    { name: "Shopping", amount: 0, color: "bg-cyan-500", icon: ShoppingCart },
    { name: "Food & Drinks", amount: 0, color: "bg-amber-500", icon: Utensils },
    { name: "Bills & Utilities", amount: 0, color: "bg-red-500", icon: Home },
    { name: "Others", amount: 0, color: "bg-gray-800", icon: Leaf },
  ]);

  const [settings, setSettings] = useState({
    currency: "₹",
    budgetLimit: 0,
    notifications: false,
    darkMode: false,
  });

  const [budget, setBudget] = useState({
    total: 0,
    categories: {},
  });

  // ✅ Fetch balance from actual backend
  const fetchUserAndBalance = async () => {
    if (!authUser?.token) return;

    try {
      const res = await axios.get("http://localhost:5002/user/profile", {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      });

      const { user } = res.data;
      if (user?.balance !== undefined) {
        const numericBalance = Number(user.balance);
        console.log("✅ Balance fetched and set:", numericBalance);
        setBalance(numericBalance);
      }
    } catch (error) {
      console.error("❌ Failed to fetch user profile:", error);
    }
  };

  useEffect(() => {
    if (authUser) {
      fetchUserAndBalance();
    }
  }, [authUser]);

  const addTransaction = async (transaction) => {
    try {
      const res = await fetch("http://localhost:5002/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser.token}`,
        },
        body: JSON.stringify(transaction),
      });

      const data = await res.json();

      if (res.ok) {
        setTransactions((prev) => [...prev, data]);
        await fetchUserAndBalance();
      } else {
        console.error("❌ Failed to add transaction:", data.message);
      }
    } catch (err) {
      console.error("❌ Error adding transaction:", err);
    }
  };

  const deleteTransaction = async (id) => {
    if (!authUser?.token) return;

    try {
      const res = await fetch(`http://localhost:5002/api/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },
      });

      if (res.ok) {
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
        await fetchUserAndBalance();
      } else {
        console.error("❌ Failed to delete transaction");
      }
    } catch (err) {
      console.error("❌ Error deleting transaction:", err);
    }
  };

  const updateBalanceAndCategories = (transaction) => {
    if (transaction.type === "income") {
      setBalance((prev) => prev + transaction.sum);
    } else if (transaction.type === "expense") {
      const amount = Math.abs(transaction.sum);
      setBalance((prev) => prev - amount);
      setCategories((prev) =>
        prev.map((cat) =>
          cat.name === transaction.category
            ? { ...cat, amount: cat.amount + amount }
            : cat
        )
      );
    }
  };

  console.log("✅ Balance in App:", balance);
  console.log("✅ AuthUser:", authUser);

  return (
    <Routes>
      <Route
        path="/login"
        element={!authUser ? <Login /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!authUser ? <Signup /> : <Navigate to="/" />}
      />

      {authUser && (
        <>
          <Route
            path="/"
            element={
              <FinancialDashboard
                transactions={transactions}
                addTransaction={addTransaction}
                deleteTransaction={deleteTransaction}
                balance={balance}
                categories={categories}
                setCategories={setCategories}
                updateBalanceAndCategories={updateBalanceAndCategories}
                budget={budget}
                setBudget={setBudget}
                settings={settings}
                setSettings={setSettings}
              />
            }
          />
          <Route
            path="/budget"
            element={
              <BudgetPage
                transactions={transactions}
                categories={categories}
                budget={budget}
                setBudget={setBudget}
                settings={settings}
              />
            }
          />
          <Route
            path="/transactions"
            element={
              <TransactionPage
                transactions={transactions}
                addTransaction={addTransaction}
                deleteTransaction={deleteTransaction}
                categories={categories}
                setCategories={setCategories}
                updateBalanceAndCategories={updateBalanceAndCategories}
                setBalance={setBalance}
              />
            }
          />
        </>
      )}

      <Route
        path="*"
        element={<Navigate to={authUser ? "/" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
