import { useState, useEffect } from 'react';
import type { Expense } from '../../interfaces/FinanceData';

const STORAGE_KEY = 'finance_manager_expenses';

const loadStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

const saveStorage = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const DEFAULT_EXPENSES: Expense[] = [
  {
    id: 'EXP-001',
    amount: 450,
    description: 'Printer cartridges and notepads',
    spentAt: 'Stationery World',
    spentOn: '2026-05-28',
    proof: 'receipt-stationery.pdf',
  },
  {
    id: 'EXP-002',
    amount: 1280,
    description: 'Delivery route fuel',
    spentAt: 'FuelStop',
    spentOn: '2026-05-26',
    proof: 'fuel-slip.jpg',
  },
];

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    loadStorage<Expense[]>(STORAGE_KEY, DEFAULT_EXPENSES),
  );
  const [loading, setLoading] = useState(false);

  // Persist expenses to localStorage whenever they change
  useEffect(() => {
    saveStorage(STORAGE_KEY, expenses);
  }, [expenses]);

  const createExpense = async (expenseData: Omit<Expense, 'id'>) => {
    setLoading(true);
    try {
      const newExpense: Expense = {
        ...expenseData,
        id: `EXP-${(expenses.length + 1).toString().padStart(3, '0')}`,
      };
      setExpenses((prev) => [newExpense, ...prev]);
      return newExpense;
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
    setLoading(true);
    try {
      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === id ? { ...expense, ...expenseData } : expense,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    setLoading(true);
    try {
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const getExpenseById = (id: string) => expenses.find((e) => e.id === id);

  const getExpensesByMonth = (year: number, month: number) => {
    return expenses.filter((expense) => {
      const date = new Date(expense.spentOn);
      return date.getFullYear() === year && date.getMonth() === month - 1;
    });
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getMonthlyExpenses = () => {
    const now = new Date();
    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.spentOn);
        return (
          expenseDate.getMonth() === now.getMonth() &&
          expenseDate.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  return {
    expenses,
    loading,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
    getExpensesByMonth,
    getTotalExpenses,
    getMonthlyExpenses,
  };
};
