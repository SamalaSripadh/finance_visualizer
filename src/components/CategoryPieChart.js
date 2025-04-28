"use client";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#4F46E5", "#F59E42", "#10B981", "#F43F5E", "#6366F1", "#FBBF24"];
const categories = ['Food', 'Rent', 'Utilities', 'Shopping', 'Salary', 'Other'];

export default function CategoryPieChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/transactions");
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const transactions = await res.json();
      const grouped = categories.map((cat) => ({
        name: cat,
        value: transactions.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0)
      })).filter(d => d.value > 0);
      setData(grouped);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!data.length) return <div>No category data yet.</div>;

  return (
    <div className="chart-container">
      <h2>Spending by Category</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {data.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={v => `$${v}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 