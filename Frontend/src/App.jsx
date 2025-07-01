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
useEffect(() => {
  if (settings.darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [settings.darkMode]);

  const [budget, setBudget] = useState({
    total: 0,
    categories: {},
  });

  // ✅ Fetch balance from actual backend
  const fetchUserAndBalance = async () => {
    console.log("➡️ Calling fetchUserAndBalance");

    if (!authUser?.token) return;

    try {
      const res = await axios.get("http://localhost:5002/user/profile", {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
        },withCredentials: true,
      });

      const { user } = res.data;
      if (user?.balance !== undefined) {
        const numericBalance = Number(user.balance);
        console.log("✅ Balance fetched and set:", numericBalance);
        setBalance(numericBalance);
      }
    } catch (error) {
  console.error("❌ Failed to fetch user profile:", error.response?.data || error.message);
}

  };
console.log("🔍 AuthUser at top of App:", authUser);

  useEffect(() => {
    console.log("🔥 useEffect triggered");
    if (authUser) {
      fetchUserAndBalance();
      fetchTransactions();
       fetchCategories();
    }
  }, [authUser]);
  console.log("✅ Balance in App:", balance);

const fetchTransactions = async () => {
  if (!authUser?.token) return;

  try {
    const res = await fetch("http://localhost:5002/api/transactions", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authUser.token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setTransactions(data); // ✅ update state
    } else {
      console.error("❌ Failed to fetch transactions:", data.message);
    }
  } catch (err) {
    console.error("❌ Error fetching transactions:", err);
  }
};

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
  await fetchTransactions();        // ✅ Refresh transaction list
await fetchUserAndBalance();     // ✅ Refresh balance

  console.log("🔥 Updated balance (local):", balance);

  // ✅ Optionally also re-fetch from server in background
} else {
        console.error("❌ Failed to add transaction:", data.message);
      }
    } catch (err) {
      console.error("❌ Error adding transaction:", err);
    }
  };

 // Send the transaction along with DELETE request
const deleteTransaction = async (transaction) => {
  if (!authUser?.token) return;

  try {
    const res = await fetch(`http://localhost:5002/api/transactions/${transaction._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authUser.token}`,
      },
      body: JSON.stringify({ transaction }), // ✅ send full transaction
    });

    if (res.ok) {
      const adjustment = transaction.type === "income" ? -transaction.amount : +transaction.amount;

      await fetch("http://localhost:5002/user/update-balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser.token}`,
        },
        body: JSON.stringify({ delta: adjustment }),
      });

      await fetchTransactions();
      await fetchUserAndBalance();
    } else {
      console.error("❌ Failed to delete transaction");
    }
  } catch (err) {
    console.error("❌ Error deleting transaction:", err);
  }
};


  const updateBalanceAndCategories = (transaction) => {
  const amount = Number(transaction.sum); // ⬅️ ensure it's a number

  if (transaction.type === "income") {
    setBalance((prev) => prev + amount);
  } else if (transaction.type === "expense") {
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

  const fetchCategories = async () => {
  if (!authUser?.token) return;

  try {
    const res = await fetch("http://localhost:5002/api/categories", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authUser.token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setCategories(data.map((cat) => ({ ...cat, amount: 0 }))); // if `amount` not in backend
    } else {
      console.error("❌ Failed to fetch categories:", data.message);
    }
  } catch (err) {
    console.error("❌ Error fetching categories:", err);
  }
};


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
