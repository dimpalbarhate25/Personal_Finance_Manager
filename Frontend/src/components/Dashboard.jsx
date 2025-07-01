import React, { useMemo ,useEffect ,useState } from "react";
import { Link } from "react-router-dom";
import { AccountsPieChart, Tips } from "./DashboardWidgets";
import BudgetPage from "./BudgetPage"; 
import TransactionPage from "./TransactionPage"; // Adjust path as needed
import { useNavigate } from "react-router-dom";
import CategoriesList from "./categories/CategoriesList";
import axios from "axios";

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
  Building,
  Trash2,
  Edit3,
  IndianRupee,
  ReceiptText,
 

  Banknote,
  PiggyBank,
  Building2,
} from "lucide-react";

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
  Line,
} from "recharts";
const loginUser = async () => {
  const response = await axios.post("/api/login", credentials);
  localStorage.setItem("token", response.data.token); // ✅ this is safe
};

const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/transactions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setTransactions(data); // ✅ update state
  } catch (err) {
    console.error("Fetch failed", err);
  }
};

const FinancialDashboard = ({
  transactions,
  addTransaction,
  deleteTransaction,
  balance,
  categories,
  setCategories,
  updateBalanceAndCategories,
  budget,            // ✅ receive it here
  setBudget  
}) => {
  const [categoryRefreshKey, setCategoryRefreshKey] = useState(0);
// Capitalizes the first letter of a string
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("bg-indigo-500");
  const [newCategoryIcon, setNewCategoryIcon] = useState("ShoppingCart"); // use string to store icon name
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
   console.log("Balance prop in Dashboard:", balance);
  //For deleting the category
  const handleDeleteCategory = (indexToDelete) => {
    const updatedCategories = categories.filter(
      (_, index) => index !== indexToDelete
    );
    setCategories(updatedCategories);
  };

  // Inside your component

  const chartColors = [
    "#10b981",
    "#f97316",
    "#3b82f6",
    "#ec4899",
    "#6366f1",
    "#f59e0b",
    "#8b5cf6",
    "#ef4444",
    "#14b8a6",
    "#84cc16",
    "#eab308",
    "#0ea5e9",
  ];
  const COLORS = ["#4ade80", "#f472b6", "#60a5fa", "#facc15", "#c084fc"];
  const navigate = useNavigate();

  // ✅ Declare these first
  const categorySums = {};
  const purposeSums = [];

  transactions.forEach((tx) => {
  if (tx.type !== "expense") return;

  const category = tx.category || "Uncategorized";
  const purpose = tx.note || "General";
  const amount = Math.abs(Number(tx.amount || tx.sum || 0));

  if (!categorySums[category]) categorySums[category] = 0;
  categorySums[category] += amount;

  purposeSums.push({
    name: purpose,
    category,
    value: amount,
  });
});

  const categoryData = Object.entries(categorySums).map(
    ([name, value], index) => ({
      name,
      value,
      color: chartColors[index % chartColors.length],
    })
  );

  const colorOptions = [
    "bg-pink-500",
    "bg-sky-500",
    "bg-purple-500",
    "bg-yellow-400",
    "bg-green-500",
    "bg-indigo-500",
    "bg-gray-500",
  ];

  const iconOptions = {
    ShoppingCart,
    Utensils,
    Home,
    Leaf,
    CreditCard,
    Wallet,
    Building,
  };
const thisMonthCashAdded = useMemo(() => {
  return transactions
    .filter(
      (tx) =>
        tx.category === "Cash" &&
        tx.type === "income" &&
        tx.date.startsWith(new Date().toISOString().slice(0, 7))
    )
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
}, [transactions]);



 const [accounts, setAccounts] = useState([]);
useEffect(() => {
  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5002/api/accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data);
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    }
  };

  fetchAccounts();
}, []);
useEffect(() => {
  if (accounts.length > 0 && !newCash.account) {
    setNewCash((prev) => ({
      ...prev,
      account: accounts[0].name, // set to first valid account name
    }));
  }
}, [accounts]);

  const [newExpense, setNewExpense] = useState({
    purpose: "",
    sum: "",
    date: "",
    category: "Food & Drinks",
  });

const [newCash, setNewCash] = useState({
  amount: "",
  account: accounts[0]?.name || "",  // <-- dynamically assign first available
  description: "",
});


const [newAccount, setNewAccount] = useState({
  name: "",
  type: "checking",
  balance: "",
  icon: "Wallet",
});

  const [settings, setSettings] = useState(() => {
  const stored = localStorage.getItem("user-settings");
  return stored
    ? JSON.parse(stored)
    : {
        currency: "INR",
        budgetLimit: 1000,
        notifications: true,
        darkMode: false,
      };
});
useEffect(() => {
  localStorage.setItem("user-settings", JSON.stringify(settings));
}, [settings]);

useEffect(() => {
  if (settings.darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [settings.darkMode]);


const computedCategories = [
  "Shopping",
  "Food & Drinks",
  "Bills & Utilities",
  "Others",
].map((name) => {
  const amount = transactions
    .filter((tx) => tx.category === name && tx.type === "expense")
    .reduce((sum, tx) => sum + Math.abs(tx.amount || tx.sum || 0), 0);

  const colorMap = {
    Shopping: "bg-cyan-500",
    "Food & Drinks": "bg-amber-500",
    "Bills & Utilities": "bg-red-500",
    Others: "bg-gray-800",
  };

  const iconMap = {
    Shopping: ShoppingCart,
    "Food & Drinks": Utensils,
    "Bills & Utilities": Home,
    Others: Leaf,
    
  };

  return {
    name,
    amount,
    color: colorMap[name],
    icon: iconMap[name],
  };
});

  const mergedCategories = [...computedCategories];

categories.forEach((catFromDb) => {
  const alreadyExists = mergedCategories.some(
    (cat) => cat.name.toLowerCase() === catFromDb.name.toLowerCase()
  );

  if (!alreadyExists) {
const Icon = iconOptions[capitalize(catFromDb.icon)] || null;
    const amount = transactions
      .filter(
        (tx) => tx.category === catFromDb.name && tx.type === "expense"
      )
      .reduce((sum, tx) => sum + Math.abs(tx.amount || tx.sum || 0), 0);

    mergedCategories.push({
       _id: catFromDb._id,
      name: catFromDb.name,
      amount,
      color: catFromDb.color,
      icon: Icon,
    });
  }
});

const defaultCategories = [
  { name: "Shopping", color: "bg-cyan-500", icon: "ShoppingCart" },
  { name: "Food & Drinks", color: "bg-amber-500", icon: "Utensils" },
  { name: "Bills & Utilities", color: "bg-red-500", icon: "Home" },
  { name: "Others", color: "bg-gray-800", icon: "Leaf" }
];

const mergedCategoriesForForm = [
  ...defaultCategories,
  ...categories.filter(
    (catFromDb) =>
      !defaultCategories.some(
        (staticCat) =>
          staticCat.name.toLowerCase() === catFromDb.name.toLowerCase()
      )
  ),
];



  //category handling and adding

const handleAddCategory = async () => {
  if (!newCategoryName.trim()) {
    alert("Please enter a category name");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const res = await axios.post(
      "http://localhost:5002/api/categories",
      {
        name: newCategoryName,
        icon: newCategoryIcon,
        color: newCategoryColor,
        budgetLimit: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    // ✅ Add the new category to local state
    setCategories((prev) => [...prev, { ...res.data, amount: 0 }]);

    // Reset form
    setNewCategoryName("");
    setNewCategoryColor("bg-indigo-500");
    setNewCategoryIcon("ShoppingCart");
  } catch (err) {
    console.error("Error adding category:", err);
    alert("Failed to add category");
  }
};




  // Handle adding expense
 const handleAddExpense = async () => {
  const { purpose, sum, date, category } = newExpense;

  const parsedAmount = parseFloat(sum);
  if (!purpose || isNaN(parsedAmount) || parsedAmount <= 0 || !date || !category) {
    return alert("Please fill all fields correctly");
  }

  const transaction = {
    note: purpose,
    category,
    amount: parsedAmount,
    date,
    type: "expense",
  };

  try {
    await addTransaction(transaction); // Sends to backend, updates state
    setNewExpense({
      purpose: "",
      sum: "",
      date: "",
      category: "Food & Drinks",
    });
    alert("Expense added successfully!");
  } catch (err) {
    console.error("Failed to add expense:", err);
    alert("Error adding expense");
  }
};

const handleDeleteCategoryCard = async (category) => {
  const confirmDelete = window.confirm(
    `Are you sure you want to delete "${category.name}" and its transactions?`
  );
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");

  try {
    const res = await axios.delete(
      `http://localhost:5002/api/categories/${category._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { refundedAmount, newBalance } = res.data;

    // Update local UI
    setCategories((prev) =>
      prev.filter((cat) => cat._id !== category._id)
    );
    setTransactions((prev) =>
      prev.filter((tx) => tx.category !== category.name)
    );

    // ✅ Update global balance with backend value
    updateBalanceAndCategories({
      type: "income",
      amount: refundedAmount,
    });

    alert(`Deleted "${category.name}". ₹${refundedAmount} refunded.`);
  } catch (err) {
    console.error("Failed to delete category:", err);
    alert("Error deleting category.");
  }
};


  // Handle adding cash
 const handleAddCash = async () => {
  const token = localStorage.getItem("token");

  const parsedAmount = parseFloat(newCash.amount);
  if (!parsedAmount || parsedAmount <= 0 || !newCash.account) {
    return alert("Please fill all fields correctly");
  }

  const selectedAccount = accounts.find(
  (acc) => acc.name === newCash.account
);
if (!selectedAccount) {
  alert("Selected account not found");
  return;
}


  try {
    const res = await axios.post(
      "http://localhost:5002/api/cash/add",
       {
    amount: parsedAmount,
    accountName: selectedAccount.name, // ✅ Fix this
    description: newCash.description, 
  },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ Update accounts state
    setAccounts((prev) =>
      prev.map((acc) =>
        acc._id === res.data.updatedAccount._id
          ? res.data.updatedAccount
          : acc
      )
    );

    // ✅ Update global balance
    const updatedBalance = Number(res.data.updatedBalance);
    if (!isNaN(updatedBalance)) {
      setBalance(updatedBalance);
    }

    // ✅ Update transactions (prepend)
    setTransactions((prev) => [res.data.transaction, ...prev]);

    // ✅ Reset form
    setNewCash({ amount: "", account: "", description: "" });
    alert("Cash added successfully!");
    console.log("Available accounts:", accounts.map(a => a.name));
console.log("Selected:", newCash.account);

  } catch (err) {
    console.error("Failed to add cash:", err);
    alert("Error adding cash");
  }
};


  // Handle adding new account
const handleAddAccount = async () => {
  const token = localStorage.getItem("token");

  const name = newAccount.name?.trim();
const type = newAccount.type?.trim();
const balanceRaw = newAccount.balance;
const balance = parseFloat(balanceRaw);
const parsedBalance = parseFloat(newAccount.balance);

if (!newAccount.name || !newAccount.type || isNaN(parsedBalance) || parsedBalance <= 0) {
  alert("Please fill all fields correctly");
  return;
}


  try {
    const res = await axios.post(
      "http://localhost:5002/api/accounts",
      {
    name: newAccount.name,
    type: newAccount.type,
    balance: parsedBalance,
    icon: newAccount.icon,
  },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAccounts((prev) => [...prev, res.data.account]);

    const updatedBalance = Number(res.data.updatedBalance);
    if (!isNaN(updatedBalance)) {
      setBalance(updatedBalance);
    }

    if (res.data.transaction) {
      setTransactions((prev) => [res.data.transaction, ...prev]);
    }

    setNewAccount({ name: "", type: "", balance: "", icon: "" });
    console.log("DEBUG - name:", name);
console.log("DEBUG - type:", type);
console.log("DEBUG - balance input:", balanceInput);
console.log("DEBUG - parsed balance:", parsedBalance);

    alert("Account added successfully!");
  } catch (err) {
    console.error("Error adding account:", err);
    alert("Failed to add account");
  }
};





  // Handle deleting account
const handleDeleteAccount = async (account) => {
  const confirm = window.confirm(`Delete account "${account.name}" and its transactions?`);
  if (!confirm) return;

  const token = localStorage.getItem("token");

  try {
    const res = await axios.delete(`http://localhost:5002/api/accounts/${account._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ Update frontend state
    setAccounts((prev) => prev.filter((a) => a._id !== account._id));
    setTransactions((prev) =>
      prev.filter(
        (tx) =>
          !tx.note?.toLowerCase().includes(`initial deposit to ${account.name.toLowerCase()}`)
      )
    );

    const updatedBalance = Number(res.data.updatedBalance);
    if (!isNaN(updatedBalance)) {
      setBalance(updatedBalance);
    }

    alert("Account and related transactions deleted.");
  } catch (err) {
    console.error("Failed to delete account:", err);
    alert("Error deleting account.");
  }
};


const handleUpdateCategoryBudget = async (categoryId, newLimit) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.patch(
      `http://localhost:5002/api/categories/${categoryId}`,
      { budgetLimit: parseFloat(newLimit) },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update category locally
    setCategories((prev) =>
      prev.map((cat) =>
        cat._id === categoryId ? { ...cat, budgetLimit: res.data.budgetLimit } : cat
      )
    );
  } catch (err) {
    console.error("Failed to update budget limit", err);
    alert("Could not update budget limit");
  }
};


  // Handle updating settings
  const handleUpdateSettings = () => {
    alert("Settings updated successfully!");
  };

  // Delete transaction
  const handleDeleteTransaction = (transactionId) => {
    const transaction = transactions.find((t) => t.id === transactionId);
    if (!transaction) return;







    // Update category if it's an expense
    if (transaction.type === "expense") {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.name === transaction.category
            ? { ...cat, amount: Math.max(0, cat.amount + transaction.sum) }
            : cat
        )
      );
    }

    // Remove transaction
    setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
  };

  // Chart data
  const pieData = categories
    .filter((cat) => cat.amount > 0)
    .map((cat) => ({
      name: cat.name,
      value: cat.amount,
    }));

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = months.map((month, index) => {
    const income = transactions
      .filter((tx) => {
        const txDate = new Date(tx.date);
        return (
          tx.type === "income" &&
          txDate.getFullYear() === selectedYear &&
          txDate.getMonth() === index
        );
      })
.reduce((sum, tx) => sum + Number(tx.amount || tx.sum || 0), 0);

    const expenses = transactions
      .filter((tx) => {
        const txDate = new Date(tx.date);
        return (
          tx.type === "expense" &&
          txDate.getFullYear() === selectedYear &&
          txDate.getMonth() === index
        );
      })
 .reduce((sum, tx) => sum + Math.abs(Number(tx.amount || tx.sum || 0)), 0); // FIXED

    return { month, income, expenses };
  });

  const thisMonthIncome = transactions
  .filter(tx => tx.type === "income" && tx.date.startsWith(new Date().toISOString().slice(0, 7)))
  .reduce((amount, tx) => amount + tx.amount, 0);

const incomeTarget = 50000; // or from settings
const percentage = incomeTarget > 0
  ? Number((thisMonthIncome / incomeTarget) * 100)
  : 0;



  const getCategoryColor = (category) => {
    const colors = {
      Income: "bg-green-500",
      "Food & Drinks": "bg-amber-500",
      Others: "bg-gray-500",
      "Bills & Utilities": "bg-red-500",
      Shopping: "bg-cyan-500",
    };
    return colors[category] || "bg-gray-500";
  };


  useEffect(() => {
  console.log("DASHBOARD balance:", balance);
}, [balance]);

 if (typeof balance !== "number") return null;
  const MenuItem = ({ icon: Icon, label, isActive, onClick }) => (
    <div
      className={`group relative flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors duration-300 ${
        isActive
          ? "bg-fuchsia-200 text-black"
          : "text-black hover:text-white hover:bg-fuchsia-700"
      }`}
      onClick={onClick}
    >
      <Icon size={20} />
      <span className="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-500 group-hover:after:w-full">
        {label}
      </span>
    </div>
  );

  

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white text-black p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-fuchsia-800 rounded-lg flex items-center justify-center">
            <span className="text-xl text-white font-bold">H</span>
          </div>
          <div>
            <h2 className="text-xl font-bold">FinanceFlow</h2>
            <p className="text-sm text-gray-800 ">Hello, user </p>
            <p className="text-sm text-gray-900">Administrator • Online</p>
          </div>
        </div>

        <nav className="space-y-2 ">
          <MenuItem
            icon={BarChart3}
            label="Dashboard"
            isActive={activeTab === "Dashboard"}
            onClick={() => setActiveTab("Dashboard")}
          />
          <MenuItem
            icon={Plus}
            label="Add Cash"
            isActive={activeTab === "AddCash"}
            onClick={() => setActiveTab("AddCash")}
          />
          <MenuItem
            icon={CreditCard}
            label="Accounts"
            isActive={activeTab === "Accounts"}
            onClick={() => setActiveTab("Accounts")}
          />
          <MenuItem
            icon={ReceiptText}
            label="Transactions"
            isActive={activeTab === "Transactions"}
            onClick={() => setActiveTab("Transactions")}
          />

          <MenuItem
            icon={Wallet}
            label="Budget"
            isActive={activeTab === "Budget"}
            onClick={() => setActiveTab("Budget")}
          />
          <MenuItem
            icon={Settings}
            label="Settings"
            isActive={activeTab === "Settings"}
            onClick={() => setActiveTab("Settings")}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "Dashboard" && (
          <div className="p-6">
            {/* White Container */}
            <div className="bg-white p-4 md:p-5 rounded-xl shadow-md max-h-[90vh] overflow-auto">
              {/* Balance and Category Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Balance Card */}
                <div className="lg:col-span-2 bg-pink-600 text-white p-4 rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold opacity-90">
                      Balance
                    </span>
                    <IndianRupee size={24} />
                  </div>
                  <div className="text-3xl font-bold">
{settings.currency} {typeof balance === "number" ? balance.toFixed(2) : "0.00"}</div>

                </div>



                {/* Category Cards */}
 {mergedCategories.map((category, index) => {
  const Icon = category.icon;
  return (
    <div
      key={category.name + index}
      className={`${category.color} text-white p-4 rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg relative`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xl opacity-90">{category.name}</span>
        {Icon ? <Icon size={24} /> : <span>❓</span>}
      </div>
      <div className="text-xl font-bold mb-6">
        {settings.currency} {Number(category.amount || 0).toFixed(2)}
      </div>
       {/* 🗑️ Delete Button */}
      {category._id && (
  <button
    onClick={() => handleDeleteCategoryCard(category)}
    className="absolute bottom-2 right-2 text-white hover:text-red-300"
    title="Delete"
  >
    <Trash2 size={16} />
  </button>
)}

    </div>
  );
})}


              </div>
            </div>

            <div>
              {/* Add Category*/}
              <div className="  flex mb-7 pt-10 flex-col lg:flex-row gap-8 px-6">
                <div className="bg-white   p-6 rounded-lg shadow w-full lg:w-1/2">
                  <div className="space-y-5">
                    <h3 className="text-lg font-semibold ">Add New Category</h3>

                    <input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Category name"
                      className="w-full px-3 py-2 border rounded "
                    />


                    <div className="space-y-5 !mb-10">
                      <label className="block text-base font-medium mb-1 ">
                        Choose Color
                      </label>
                      <div className="flex flex-wrap gap-2 ">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            onClick={() => setNewCategoryColor(color)}
                            className={`w-6 h-6 rounded-full border-2  ${color} ${
                              newCategoryColor === color
                                ? "ring-2 ring-black"
                                : ""
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <label className="block text-base font-medium mb-1 -mt-5">
                      Choose Icon
                    </label>
                    <div className="grid grid-cols-4 gap-4 ">
                      {Object.keys(iconOptions).map((key) => {
                        const Icon = iconOptions[key];
                        return (
                          <button
                            key={key}
                            onClick={() => setNewCategoryIcon(key)}
                            className={`p-2 rounded border ${
                              newCategoryIcon === key
                                ? "border-fuchsia-800"
                                : "border-gray-300"
                            }`}
                          >
                            <Icon size={21} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={handleAddCategory}
                    className="bg-fuchsia-800 text-white px-4 py-2 rounded w-full mt-10  mr-4"
                  >
                    Add Category
                  </button>
                  <h2 className="text-xl font-semibold mt-4 mb-2">Your Categories</h2>

                </div>

                {/* Charts Section Expense Distribution*/}
                <div className>
                  <div className="![width:105%] ![height:500px] bg-white rounded-lg shadow p-1">
                    <h2 className="text-2xl font-semibold mb-4 text-center mt-4">
                      Expense Distribution
                    </h2>
                    {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        {/* Inner pie - Categories */}
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={70}
                          label
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cat-${index}`} fill={entry.color} />
                          ))}
                        </Pie>

                        {/* Outer pie - Purposes */}
                        <Pie
                          data={purposeSums}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={75}
                          outerRadius={100}
                          label={({ name, value }) => `${name} (${value})`}
                        >
                          {purposeSums.map((entry, index) => {
                            const categoryIndex = categoryData.findIndex(
                              (cat) => cat.name === entry.category
                            );
                            const color =
                              chartColors[categoryIndex % chartColors.length];
                            return (
                              <Cell
                                key={`purpose-${index}`}
                                fill={color}
                                stroke="#fff"
                              />
                            );
                          })}
                        </Pie>

                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    ) : (
                      <div className="text-center text-gray-500 py-10">
    No expense data to visualize yet.
  </div>
)}
                  </div>
                </div>
              </div>
            </div>
            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-lg shadow mb-5">
              <h3 className="text-lg font-semibold mb-4">Monthly Overview</h3>
              <div className="mb-4">
                <label className="mr-2 font-medium">Select Year:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="border px-2 py-1 rounded"
                >
                  {/* You can predefine or generate years dynamically */}
                  <option value={2024}>2023</option>
                  <option value={2025}>2024</option>
                  <option value={2026}>2025</option>
                  <option value={2027}>2026</option>
                  <option value={2028}>2027</option>
                  <option value={2029}>2028</option>
                </select>
              </div>
              <div border-bg="20px" className="mb-2">
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
                <div className="p-6 border-b flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Recent Transactions</h3>
                  <Link
                    to="/transactions"
                    className="text-fuchsia-800 text-sm underline hover:text-fuchsia-700 font-bold"
                  >
                    View All →
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  {transactions.length > 0 ? (
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Purpose
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sum
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {transaction.note}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getCategoryColor(
                                  transaction.category
                                )}`}
                              >
                                {transaction.category}
                              </span>
                            </td>
                            <td
                              className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                transaction.type === "income"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "income" ? "+" : ""}
{Number(transaction.amount || 0).toFixed(2)} {settings.currency}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {transaction.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() =>
                                  deleteTransaction(transaction)
                                }
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
                      <p>
                        No transactions yet. Add your first expense or income!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Expenditure */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b bg-fuchsia-800 text-white rounded-t-lg">
                  <h3 className="text-lg font-semibold">Add Expenditure</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purpose
                    </label>
                    <input
                      type="text"
                      value={newExpense.purpose}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          purpose: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
                      placeholder="Enter purpose"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sum
                    </label>
                    <input
                      type="number"
                      value={newExpense.sum}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, sum: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) =>
                        setNewExpense({ ...newExpense, date: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                     {mergedCategories.map((cat) => {
  const Icon = cat.icon;
  return (
    <button
      key={cat.name}
      type="button"
      onClick={() =>
        setNewExpense({ ...newExpense, category: cat.name })
      }
      className={`p-2 rounded-lg border text-sm ${
        newExpense.category === cat.name
          ? "border-fuchsia-800 bg-red-50 text-fuchsia-700"
          : "border-gray-300 hover:border-gray-400"
      }`}
    >
      {Icon && <Icon size={16} className="mx-auto mb-1" />}
      {cat.name}
    </button>
  );
})}

                    </div>
                  </div>
                  <button
                    onClick={handleAddExpense}
                    className="w-full bg-fuchsia-800 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition-colors"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>

            {activeTab === "Transactions" && (
              <TransactionPage transactions={transactions} />
            )}

            {/* Progress Bars Section */}
           {/* ✅ Progress Bars Section — Working for static + user categories */}
<div className="mt-8 bg-white rounded-lg shadow p-6">
  <h3 className="text-lg font-semibold mb-6">Budget Progress</h3>

  <div className="space-y-6">
    {[
      ...["Shopping", "Food & Drinks", "Bills & Utilities", "Others"].map((name) => {
        const staticCat = computedCategories.find((c) => c.name === name) || {};
        return {
          name,
          amount: staticCat.amount || 0,
          budgetLimit: staticCat.budgetLimit || 1000,
          _id: null,
        };
      }),
      ...categories
  .filter(
    (cat) =>
      !["Shopping", "Food & Drinks", "Bills & Utilities", "Others"].includes(cat.name)
  )
  .map((cat) => {
    const spent = transactions
      .filter((tx) => tx.category === cat.name && tx.type === "expense")
      .reduce((sum, tx) => sum + Math.abs(Number(tx.amount || tx.sum || 0)), 0);

    return {
      name: cat.name,
      amount: spent,
      budgetLimit: cat.budgetLimit || 1000,
      _id: cat._id,
    };
  })

    ].map((category, index) => {
      const spent = category.amount;
      const budget = category.budgetLimit;
      const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

      const handleBudgetChange = (e) => {
        const newLimit = parseFloat(e.target.value);
        if (isNaN(newLimit) || newLimit < 0) return;

        if (category._id) {
          handleUpdateCategoryBudget(category._id, newLimit);
        } else {
          setCategories((prev) =>
            prev.map((cat) =>
              cat.name === category.name ? { ...cat, budgetLimit: newLimit } : cat
            )
          );
        }
      };

      return (
        <div key={index} className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">{category.name}</span>
            <span className="text-sm text-gray-500">
              ₹{spent.toFixed(2)} / ₹{budget.toFixed(2)}
            </span>
          </div>

          <input
            type="number"
            className="text-sm border px-2 py-1 rounded w-32 mb-1"
            defaultValue={budget}
            onBlur={handleBudgetChange}
          />

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                percentage > 80
                  ? "bg-fuchsia-400"
                  : percentage > 60
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="text-xs text-gray-500">
            {percentage.toFixed(1)}% of budget used
          </div>
          {/* ⚠ Budget Exceeded Alert */}
  {spent > budget && (
    <div className="text-xs text-red-600 mt-1">
      ⚠ You've exceeded this budget by ₹{(spent - budget).toFixed(2)}
    </div>
  )}
        </div>
      );
    })}
  </div>
</div>

          </div>
        )}
        {activeTab === "Transactions" && (
          <TransactionPage
            transactions={transactions}
            addTransaction={addTransaction}
            deleteTransaction={deleteTransaction}
            categories={categories}
            setCategories={setCategories}
            updateBalanceAndCategories={updateBalanceAndCategories}
          />
        )}
        {activeTab === "Budget" && (
    <BudgetPage
      transactions={transactions}
      categories={categories}
      budget={budget}
      setBudget={setBudget}
      settings={settings} 
    />
  )}
        {activeTab === "AddCash" && (
  <div className="p-6">
    <div className="flex flex-col lg:flex-row gap-8">
      {/* LEFT: Add Cash Form */}
      <div className="w-full lg:w-1/2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Add Cash</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                value={newCash.amount}
                onChange={(e) =>
                  setNewCash({ ...newCash, amount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account
              </label>
              <select
                value={newCash.account}
                onChange={(e) =>
                  setNewCash({ ...newCash, account: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
              >
                {accounts.map((acc) => (
                  <option key={acc._id} value={acc.name}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={newCash.description}
                onChange={(e) =>
                  setNewCash({ ...newCash, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
            </div>

            <button
              onClick={handleAddCash}
              className="w-full bg-fuchsia-800 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition-colors"
            >
              Add Cash
            </button>
          </div>

          <div className="mt-6 text-lg font-medium text-gray-800">
  Total Cash Added in {new Date().toLocaleString('default', { month: 'long' })}: ₹
  {thisMonthCashAdded.toFixed(2)}
</div>


        </div>
      </div>

      {/* RIGHT: Recent Cash Additions */}
      <div className="w-full lg:w-1/2">
        <div className="bg-white rounded-lg shadow p-6 h-full">
          <h3 className="text-xl font-semibold mb-4">Recent Cash Additions</h3>
          <ul className="space-y-2">
            {transactions
              .filter((tx) => tx.type === "income")
              .slice(-5)
              .reverse()
              .map((tx) => (
                <li key={tx.id} className="bg-gray-50 rounded shadow p-3">
                  <div className="flex justify-between">
                    <span>{tx.note} added to {tx.account}</span>
                     
                    <span className="text-green-600 font-medium">
  ₹{Number(tx.amount || 0).toFixed(2)}
</span>

                  </div>
                  <div className="text-sm text-gray-500">{tx.date}</div>
                </li>
              ))}
          </ul>
        </div>
      </div>

      
    </div>

    <div className="mt-4">
  <p className="mb-1 text-sm font-medium text-gray-600">
    Monthly Income Goal: ₹{incomeTarget}
  </p>
  <div className="w-full bg-gray-200 rounded-full h-3">
    <div
      className="bg-green-500 h-3 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(percentage, 100)}%` }}
    ></div>
  </div>
<p className="text-xs text-gray-500 mt-1">
  {Number.isFinite(percentage) ? `${percentage.toFixed(1)}% reached` : "0% reached"}
</p>
</div>

    <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
  <h4 className="text-md font-semibold text-blue-700 mb-2">Did you receive your monthly salary?</h4>
  <p className="text-sm text-blue-800">Log it as a recurring income to track your inflow patterns.</p>
</div>

  </div>
)}

        {activeTab === "Accounts" && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Accounts</h2>
              <div className="text-lg font-semibold text-green-600">
                Total: {settings.currency}{" "}
{Number(accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)).toFixed(2)}
              </div>
            </div>

            {/* Existing Accounts */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {accounts.map((account) => {
const Icon = iconOptions[account.icon] || Wallet; // fallback to Wallet if icon not found
                return (
                  <div
                    key={account._id}
                    className="bg-white rounded-lg shadow p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Icon size={24} className="text-gray-600" />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeleteAccount(account)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      {account.name}
                    </h3>
                    <div className="text-2xl font-bold text-green-600 mb-2">
{settings.currency} {Number(account.balance || 0).toFixed(2)}
                    </div>
                    <span className="text-sm text-gray-500 capitalize">
                      {account.type} Account
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Add New Account */}
            
              {/* LEFT SIDE - Existing dashboard stuff */}
              <div className="w-full xl space-y-6">
                {/* Keep all your current dashboard cards, budget progress, transactions here */}
              </div>

              {/* RIGHT SIDE - Add new content */}
              <div className="w-full xl space-y-6">
  <AccountsPieChart accounts={accounts} />
  <Tips />

  {/* ✅ Add New Account Form */}
  
  <div className="w-300 bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">Add New Account</h3>
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Account Name
        </label>
        <input
          type="text"
          value={newAccount.name}
          onChange={(e) =>
            setNewAccount({ ...newAccount, name: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
          placeholder="Enter account name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Account Type
        </label>
        <select
          value={newAccount.type}
          onChange={(e) =>
            setNewAccount({ ...newAccount, type: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
        >
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
          <option value="investment">Investment</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Initial Balance
        </label>
        <input
          type="number"
         value={newAccount.balance}
onChange={(e) =>
  setNewAccount({
    ...newAccount,
    balance: e.target.value,
  })
}

          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
          placeholder="Enter initial balance"
        />
      </div>
      <button
        onClick={handleAddAccount}
        className="w-200 bg-fuchsia-800 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition-colors"
      >
        Add Account
      </button>
    </div>
  </div>
</div>
 
</div> 
         
        )}
{activeTab === "Settings" && (
  <div className="p-6 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
    <h2 className="text-2xl font-bold mb-6">Settings</h2>

    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-md">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Currency</label>
          <select
            value={settings.currency}
            onChange={(e) =>
              setSettings({ ...settings, currency: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-800 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Monthly Budget Limit</label>
          <input
            type="number"
            value={settings.budgetLimit}
            onChange={(e) =>
              setSettings({
                ...settings,
                budgetLimit: parseFloat(e.target.value),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-800 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: e.target.checked,
                })
              }
              className="rounded border-gray-300 text-fuchsia-800 focus:ring-fuchsia-800"
            />
            <span className="text-sm font-medium">Enable Notifications</span>
          </label>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) =>
                setSettings({ ...settings, darkMode: e.target.checked })
              }
              className="rounded border-gray-300 text-fuchsia-800 focus:ring-fuchsia-800"
            />
            <span className="text-sm font-medium">Dark Mode</span>
          </label>
        </div>

        <button
          onClick={handleUpdateSettings}
          className="w-full bg-fuchsia-800 text-white py-2 px-4 rounded-lg hover:bg-fuchsia-700 transition-colors"
        >
          Update Settings
        </button>
      </div>
    </div>

    {/* Settings Summary */}
    <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-md">
      <h3 className="text-lg font-semibold mb-4">Current Settings</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Currency:</span>
          <span className="font-medium">{settings.currency}</span>
        </div>
        <div className="flex justify-between">
          <span>Budget Limit:</span>
          <span className="font-medium">
            {settings.currency} {settings.budgetLimit}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Notifications:</span>
          <span
            className={`font-medium ${
              settings.notifications ? "text-green-500" : "text-red-500"
            }`}
          >
            {settings.notifications ? "Enabled" : "Disabled"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Dark Mode:</span>
          <span
            className={`font-medium ${
              settings.darkMode ? "text-green-500" : "text-red-500"
            }`}
          >
            {settings.darkMode ? "Enabled" : "Disabled"}
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
