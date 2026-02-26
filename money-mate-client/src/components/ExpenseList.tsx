/**
 * ExpenseList.tsx - 지출 목록
 *
 * - expenses를 카드 형태로 표시 (항목명, 지불자, 금액)
 * - 수정: 수정 버튼 → 모달에서 항목/금액/지출자 변경 후 저장
 * - 삭제: deleteExpenses API 호출 후 onDelete()로 목록 갱신
 * - 합계를 setTotalSpent로 전달
 */
import React, { useState } from 'react';
import './ExpenseList.css';
import { deleteExpenses, updateExpense } from '../api/expenseApi';

interface Expense {
  id: number;
  category: string;
  title: string;
  amount: number;
  payer: string;
}

export interface ExpenseListProps {
  expenses: Expense[];
  onDelete: () => void;
  budget: number | null;
  setTotalSpent: (n: number) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete, budget, setTotalSpent }) => {
  const total = expenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
  setTotalSpent(total);

  const [editing, setEditing] = useState<Expense | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editPayer, setEditPayer] = useState('');

  const openEdit = (expense: Expense) => {
    setEditing(expense);
    setEditTitle(expense.title);
    setEditAmount(String(expense.amount));
    setEditPayer(expense.payer);
  };

  const closeEdit = () => {
    setEditing(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const amount = Number(editAmount);
    if (!editTitle.trim() || !editPayer.trim() || Number.isNaN(amount)) return;
    try {
      await updateExpense(editing.id, {
        category: editing.category,
        title: editTitle.trim(),
        amount,
        payer: editPayer.trim(),
      });
      onDelete();
      closeEdit();
    } catch (err) {
      console.error('지출 수정 실패', err);
    }
  };

  if (expenses.length === 0) {
    return (
      <div className="expense-list-empty">
        <span className="expense-list-empty-icon">📝</span>
        <p>아직 지출이 없어요</p>
        <p className="expense-list-empty-hint">위 폼에서 항목을 추가해 보세요</p>
      </div>
    );
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await deleteExpenses(id);
      onDelete();
    } catch (error) {}
  };

  return (
    <>
      <ul className="expense-list">
        {expenses.map((expense, index) => (
          <li key={expense.id} className="expense-list-item" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="expense-item">
              <div className="expense-info">
                <h3>{expense.title}</h3>
                <div className="meta">
                  <span>지불: {expense.payer}</span>
                </div>
              </div>
              <span className="expense-amount">{expense.amount.toLocaleString()}원</span>
              <div className="expense-item-actions">
                <button type="button" className="edit-btn" onClick={() => openEdit(expense)}>수정</button>
                <button type="button" className="delete" onClick={() => handleDelete(expense.id)}>삭제</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <div className="expense-edit-overlay" onClick={closeEdit}>
          <div className="expense-edit-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="expense-edit-title">지출 수정</h3>
            <form onSubmit={handleSaveEdit}>
              <div className="expense-edit-field">
                <label>항목</label>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
              </div>
              <div className="expense-edit-field">
                <label>금액 (원)</label>
                <input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} required />
              </div>
              <div className="expense-edit-field">
                <label>지출자</label>
                <input value={editPayer} onChange={(e) => setEditPayer(e.target.value)} required />
              </div>
              <div className="expense-edit-actions">
                <button type="button" className="expense-edit-cancel" onClick={closeEdit}>취소</button>
                <button type="submit" className="expense-edit-submit">저장</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpenseList;


