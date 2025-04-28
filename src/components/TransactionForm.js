'use client';

import { useState } from 'react';

const categories = ['Food', 'Rent', 'Utilities', 'Shopping', 'Salary', 'Other'];

export default function TransactionForm() {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!amount || !date || !description || !category) {
      setError('All fields are required');
      return;
    }
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount), date, description, category })
      });
      if (!res.ok) throw new Error('Failed to add transaction');
      setAmount('');
      setDate('');
      setDescription('');
      setCategory(categories[0]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <div className="form-group">
        <label>Amount</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Description</label>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <button type="submit">Add Transaction</button>
    </form>
  );
} 