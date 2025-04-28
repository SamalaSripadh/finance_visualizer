'use client';

import { useState } from 'react';
import DashboardSummary from '../components/DashboardSummary';
import CategoryPieChart from '../components/CategoryPieChart';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import ExpensesChart from '../components/ExpensesChart';
import BudgetSettings from '../components/BudgetSettings';
import BudgetVsActualChart from '../components/BudgetVsActualChart';

export default function Home() {
  const [transactions, setTransactions] = useState([]);

  const handleAddTransaction = (newTransaction) => {
    setTransactions(prev => [...prev, newTransaction]);
  };

  return (
    <main className="container">
      <h1>Finance Visualizer</h1>
      <DashboardSummary />
      <BudgetSettings />
      <BudgetVsActualChart />
      <CategoryPieChart />
      <ExpensesChart />
      <TransactionForm />
      <TransactionList />
    </main>
  );
}
