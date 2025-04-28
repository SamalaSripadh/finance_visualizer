"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const categories = ['Food', 'Rent', 'Utilities', 'Shopping', 'Salary', 'Other'];

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function BudgetVsActualChart() {
  const [budgets, setBudgets] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBudgets();
    fetchTransactions();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await fetch("/api/budgets");
      if (!res.ok) throw new Error("Failed to fetch budgets");
      const data = await res.json();
      setBudgets(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter transactions for current month
  const month = getCurrentMonth();
  const monthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === month;
  });

  // Prepare chart data
  const chartData = categories.map(cat => ({
    category: cat,
    Budget: budgets[cat] ? parseFloat(budgets[cat]) : 0,
    Actual: monthTransactions.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0)
  }));

  // Prepare insights
  const insights = chartData.map(({ category, Budget, Actual }) => {
    if (!Budget && !Actual) return null;
    if (Budget === 0) return `No budget set for ${category}.`;
    if (Actual === 0) return `No spending in ${category} yet.`;
    if (Actual < Budget) return `You are under budget in ${category} by $${(Budget - Actual).toFixed(2)}.`;
    if (Actual === Budget) return `You are exactly on budget in ${category}.`;
    return `You have exceeded your ${category} budget by $${(Actual - Budget).toFixed(2)}!`;
  }).filter(Boolean);

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="chart-container">
      <h2>Budget vs Actual (This Month)</h2>
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip formatter={v => `$${v}`} />
            <Legend />
            <Bar dataKey="Budget" fill="#6366F1" />
            <Bar dataKey="Actual" fill="#F59E42" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {insights.length > 0 && (
        <ul style={{marginTop: 24, paddingLeft: 20}}>
          {insights.map((msg, idx) => (
            <li key={idx} style={{marginBottom: 6, fontWeight: 500}}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
} 