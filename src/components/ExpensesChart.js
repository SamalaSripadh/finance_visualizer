'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ExpensesChart() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMonthlyData();
  }, []);

  const fetchMonthlyData = async () => {
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const transactions = await response.json();
      
      // Group transactions by month and calculate total expenses
      const monthlyExpenses = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!acc[monthYear]) {
          acc[monthYear] = 0;
        }
        acc[monthYear] += transaction.amount;
        
        return acc;
      }, {});

      // Convert to array format for Recharts
      const chartData = Object.entries(monthlyExpenses).map(([month, amount]) => ({
        month,
        amount: parseFloat(amount.toFixed(2))
      }));

      setMonthlyData(chartData);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900">Monthly Expenses</h2>
      <div className="mt-4 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tickFormatter={(value) => {
                const [year, month] = value.split('-');
                return new Date(year, month - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
              }}
            />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Amount']}
              labelFormatter={(label) => {
                const [year, month] = label.split('-');
                return new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
              }}
            />
            <Bar dataKey="amount" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 