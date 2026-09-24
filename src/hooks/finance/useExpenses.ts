import { useState, useEffect } from 'react';
import type { Expense } from '../../interfaces/FinanceData';
import FinanceService from '../../services/FinanceService';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setLoading(true);

        const data = await FinanceService.getExpenses();

        setExpenses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load finance expenses:', error);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  const createExpense = async (
    expenseData: Omit<Expense, 'id'>,
  ) => {
    setLoading(true);

    try {
      const newExpense = await FinanceService.createExpense(
        expenseData,
      );

      setExpenses((prev) => [newExpense as Expense, ...prev]);

      return newExpense;
    } finally {
      setLoading(false);
    }
  };

  const updateExpense = async (
    id: string,
    expenseData: Partial<Expense>,
  ) => {
    setLoading(true);

    try {
      const updatedExpense = await FinanceService.updateExpense(
        id,
        expenseData,
      );

      setExpenses((prev) =>
        prev.map((expense) =>
          expense.id === id
            ? (updatedExpense as Expense)
            : expense,
        ),
      );

      return updatedExpense;
    } finally {
      setLoading(false);
    }
  };

  const deleteExpense = async (id: string) => {
    setLoading(true);

    try {
      await FinanceService.deleteExpense(id);

      setExpenses((prev) =>
        prev.filter((expense) => expense.id !== id),
      );
    } finally {
      setLoading(false);
    }
  };

  const getExpenseById = (id: string) =>
    expenses.find((expense) => expense.id === id);

  const getExpensesByMonth = (year: number, month: number) => {
    return expenses.filter((expense) => {
      const date = new Date(expense.spentOn);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1
      );
    });
  };

  const getTotalExpenses = () => {
    return expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
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