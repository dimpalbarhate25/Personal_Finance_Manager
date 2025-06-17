import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // ✅ Only use these
import Dashboard from "./components/Dashboard";
import Signup from "./components/Signup";
import Login from "./components/Login";
import TransactionPage from "./components/TransactionPage";
import { useAuth } from "./context/AuthProvider";
import { ShoppingCart, Utensils, Home, Leaf } from "lucide-react";

function App() {
  const [authUser] = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(3325.90);
  const [categories, setCategories] = useState([
    { name: "Shopping", amount: 0, color: "bg-cyan-500", icon: ShoppingCart },
    { name: "Food & Drinks", amount: 0, color: "bg-amber-500", icon: Utensils },
    { name: "Bills & Utilities", amount: 0, color: "bg-red-500", icon: Home },
    { name: "Others", amount: 0, color: "bg-gray-800", icon: Leaf },
  ]);

  const addTransaction = (transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const updateBalanceAndCategories = (transaction) => {
    if (transaction.type === "income") {
      setBalance(prev => prev + transaction.sum);
    } else if (transaction.type === "expense") {
      const amount = Math.abs(transaction.sum);
      setBalance(prev => prev - amount);
      setCategories(prev =>
        prev.map(cat =>
          cat.name === transaction.category
            ? { ...cat, amount: cat.amount + amount }
            : cat
        )
      );
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          authUser ? (
            <Dashboard
              transactions={transactions}
              addTransaction={addTransaction}
              deleteTransaction={deleteTransaction}
              balance={balance}
              categories={categories}
              setCategories={setCategories}
              updateBalanceAndCategories={updateBalanceAndCategories}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/transactions"
        element={
          authUser ? (
            <TransactionPage
              transactions={transactions}
              addTransaction={addTransaction}
              deleteTransaction={deleteTransaction}
              categories={categories}           // ✅ Pass to TransactionPage too
               setCategories={setCategories} 
              updateBalanceAndCategories={updateBalanceAndCategories}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
      <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
