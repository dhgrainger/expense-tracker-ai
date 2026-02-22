"use client";

import { useState, useEffect, useCallback } from "react";
import { Expense, ExpenseFormData } from "@/types/expense";
import { loadExpenses, saveExpenses } from "@/utils/storage";
import { SAMPLE_EXPENSES } from "@/utils/sampleData";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = loadExpenses();
    if (stored.length === 0) {
      // Seed with sample data for first-time users
      saveExpenses(SAMPLE_EXPENSES);
      setExpenses(SAMPLE_EXPENSES);
    } else {
      setExpenses(stored);
    }
    setIsLoaded(true);
  }, []);

  const addExpense = useCallback((data: ExpenseFormData): Expense => {
    const newExpense: Expense = {
      id:
        Date.now().toString(36) + Math.random().toString(36).substring(2, 9),
      date: data.date,
      amount: parseFloat(data.amount),
      category: data.category,
      description: data.description.trim(),
      createdAt: new Date().toISOString(),
    };
    setExpenses((prev) => {
      const updated = [newExpense, ...prev].sort((a, b) =>
        b.date.localeCompare(a.date)
      );
      saveExpenses(updated);
      return updated;
    });
    return newExpense;
  }, []);

  const updateExpense = useCallback(
    (id: string, data: ExpenseFormData): void => {
      setExpenses((prev) => {
        const updated = prev
          .map((e) =>
            e.id === id
              ? {
                  ...e,
                  date: data.date,
                  amount: parseFloat(data.amount),
                  category: data.category,
                  description: data.description.trim(),
                }
              : e
          )
          .sort((a, b) => b.date.localeCompare(a.date));
        saveExpenses(updated);
        return updated;
      });
    },
    []
  );

  const deleteExpense = useCallback((id: string): void => {
    setExpenses((prev) => {
      const updated = prev.filter((e) => e.id !== id);
      saveExpenses(updated);
      return updated;
    });
  }, []);

  return { expenses, isLoaded, addExpense, updateExpense, deleteExpense };
}
