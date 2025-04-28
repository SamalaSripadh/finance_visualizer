"use client";
import { useEffect, useState } from "react";

const categories = ['Food', 'Rent', 'Utilities', 'Shopping', 'Salary', 'Other'];

export default function DashboardSummary() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/transactions");
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="error">{error}</div>;

  // Total expenses
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Top 3 categories
  const catTotals = categories.map(cat => ({
    name: cat,
    value: transactions.filter(t => t.category === cat).reduce((sum, t) => sum + t.amount, 0)
  })).filter(c => c.value > 0).sort((a, b) => b.value - a.value).slice(0, 3);

  // 3 most recent transactions
  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

  return (
    <div className="dashboard-summary" style={{display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap'}}>
      <div className="summary-card" style={{flex: 1, minWidth: 220, background: '#f3f4f6', borderRadius: 12, padding: 20}}>
        <div style={{fontWeight: 600, fontSize: 18, color: '#4F46E5'}}>Total Expenses</div>
        <div style={{fontSize: 28, fontWeight: 700, marginTop: 8}}>{total.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</div>
      </div>
      <div className="summary-card" style={{flex: 1, minWidth: 220, background: '#f3f4f6', borderRadius: 12, padding: 20}}>
        <div style={{fontWeight: 600, fontSize: 18, color: '#4F46E5'}}>Top Categories</div>
        <ul style={{margin: 0, padding: 0, listStyle: 'none'}}>
          {catTotals.length === 0 && <li style={{color: '#888'}}>No data</li>}
          {catTotals.map(cat => (
            <li key={cat.name} style={{fontSize: 16, margin: '6px 0'}}>
              <span style={{fontWeight: 500}}>{cat.name}:</span> {cat.value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
            </li>
          ))}
        </ul>
      </div>
      <div className="summary-card" style={{flex: 1, minWidth: 220, background: '#f3f4f6', borderRadius: 12, padding: 20}}>
        <div style={{fontWeight: 600, fontSize: 18, color: '#4F46E5'}}>Recent Transactions</div>
        <ul style={{margin: 0, padding: 0, listStyle: 'none'}}>
          {recent.length === 0 && <li style={{color: '#888'}}>No data</li>}
          {recent.map(t => (
            <li key={t._id} style={{fontSize: 15, margin: '6px 0'}}>
              <span style={{fontWeight: 500}}>{t.description}</span> - {t.amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}<br/>
              <span style={{fontSize: 13, color: '#666'}}>{new Date(t.date).toLocaleDateString()} ({t.category})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 