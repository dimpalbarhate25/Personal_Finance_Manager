import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Pie Chart Component
const COLORS = ["#4ade80", "#f472b6", "#60a5fa", "#facc15", "#c084fc"];

export const AccountsPieChart = ({ accounts }) => {
  const data = accounts.map((acc) => ({
    name: acc.name,
    value: acc.balance,
  }));
  

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Account Balance Distribution</h3>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-sm">No data available</p>
      )}
    </div>
  );
};

// Tips Component
export const Tips = () => {
  const tips = [
    "📊 Track your expenses weekly — know where every rupee goes!",
  "🎯 Set a clear monthly budget goal — stay focused and stress-free.",
  "🛑 Pause before you purchase — impulse buys drain savings.",
  "📈 Invest in SIPs — small steps lead to big future gains.",
  "💵 Use cash for daily spending — feel the money leave, spend wisely.",
  "🔍 Audit your subscriptions monthly — stop paying for what you don’t use.",
  "💰 Save before you spend — treat savings as your first expense.",
  "📉 Visualize your finances — graphs and charts make patterns clear.",
  "🚫 Set short-term money challenges — like a no-spend week!",
  "📚 Learn one money skill monthly — knowledge compounds like interest."
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-4 text-fuchsia-800 ">💡Financial Tip</h3>
<p className="text-xl text-pink-600 font-bold ">{randomTip}</p>
    </div>
  );
};
