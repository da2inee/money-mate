// src/components/ExpenseList.tsx
import React from 'react';
import './ExpenseList.css'
import { deleteExpenses } from '../api/expenseApi';
import { useEffect } from 'react'; // useEffect import
import BudgetList from './BudgetList';
import { BudgetListProps } from './BudgetList';
import { Typography } from '@mui/material';

interface Expense {
  id: number;
  category:string;
  title: string;
  amount: number;
  payer: string;
}

export interface ExpenseListProps {
  expenses: Expense[];
  onDelete: () => void;
  budget: number|null;
  setTotalSpent: (n: number) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, budget , setTotalSpent}) => {
   const total = expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
   setTotalSpent(total); 
     if (expenses.length === 0) {
    return <p>지출 항목이 없습니다.</p>;
  }

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteExpenses(id);
      onDelete(); // 삭제 후 목록 다시 불러오기
    } catch (error) {
    }
  };

  return (
    <ul>
      {expenses.map((expense) => (
        <li key={expense.id}>
          <div className="expense-item">
            <h3>{expense.title}</h3>
            <Typography>금액: {expense.amount}원 </Typography>
             <Typography> 지불자: {expense.payer}</Typography>
            <button  onClick={() => handleDelete(expense.id)}>삭제</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ExpenseList;


