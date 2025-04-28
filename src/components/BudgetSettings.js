"use client";
import { useEffect, useState } from "react";

const categories = ['Food', 'Rent', 'Utilities', 'Shopping', 'Salary', 'Other'];

export default function BudgetSettings() {
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/budgets");
      if (!res.ok) throw new Error("Failed to fetch budgets");
      const data = await res.json();
      setBudgets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (cat, value) => {
    setBudgets(prev => ({ ...prev, [cat]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budgets)
      });
      if (!res.ok) throw new Error("Failed to save budgets");
      setSuccess("Budgets saved!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="chart-container" style={{marginBottom: 24}}>
      <h2>Set Monthly Budgets</h2>
      {loading ? <div>Loading...</div> : (
        <form onSubmit={handleSave} style={{display: 'flex', flexWrap: 'wrap', gap: 16}}>
          {categories.map(cat => (
            <div key={cat} style={{flex: '1 1 180px'}}>
              <label>{cat}</label>
              <input
                type="number"
                min="0"
                value={budgets[cat] || ''}
                onChange={e => handleChange(cat, e.target.value)}
                placeholder="Enter budget"
                style={{width: '100%'}}
              />
            </div>
          ))}
          <div style={{flexBasis: '100%', marginTop: 12}}>
            <button type="submit">Save Budgets</button>
          </div>
          {error && <div className="error" style={{flexBasis: '100%'}}>{error}</div>}
          {success && <div style={{color: '#10B981', marginTop: 8}}>{success}</div>}
        </form>
      )}
    </div>
  );
} 