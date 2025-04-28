'use client';

import { useState, useEffect } from 'react';

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const categories = ['Food', 'Rent', 'Utilities', 'Shopping', 'Salary', 'Other'];
  const [editData, setEditData] = useState({ amount: '', date: '', description: '', category: categories[0] });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }
      setTransactions(transactions.filter(transaction => transaction._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (transaction) => {
    setEditId(transaction._id);
    setEditData({
      amount: transaction.amount,
      date: transaction.date.slice(0, 10),
      description: transaction.description,
      category: transaction.category || categories[0],
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (id) => {
    try {
      const response = await fetch(`/api/transactions?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }
      setEditId(null);
      fetchTransactions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditData({ amount: '', date: '', description: '', category: categories[0] });
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <h2>Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              {editId === transaction._id ? (
                <>
                  <td>
                    <input
                      type="date"
                      name="date"
                      value={editData.date}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="description"
                      value={editData.description}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <select name="category" value={editData.category} onChange={handleEditChange}>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      name="amount"
                      value={editData.amount}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditSave(transaction._id)} style={{marginRight: '0.5rem'}}>Save</button>
                    <button onClick={handleEditCancel}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category || ''}</td>
                  <td>${transaction.amount.toFixed(2)}</td>
                  <td>
                    <button style={{marginRight: '0.5rem'}} onClick={() => handleEdit(transaction)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(transaction._id)}>
                      Delete
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 