// src/components/BudgetList.tsx
import React, { useState, useEffect } from 'react';
import { createBudget, getBudgets, updateBudget } from '../api/budgetApi';
import './BudgetList.css';
import EditIcon from '@mui/icons-material/Edit';

export interface BudgetListProps {
  category: string;
  budget: number;
  setBudget: (value: number) => void;
  totalSpent: number;
  startDate?: string;
  endDate?: string;
}

const BudgetList: React.FC<BudgetListProps> = ({ category, budget, setBudget, totalSpent, startDate: propStart, endDate: propEnd }) => {
  const [isEditing, setIsEditing] = useState<boolean>(budget === 0);
  const [inputAmount, setInputAmount] = useState<number>(budget);
  const [inputStartDate, setInputStartDate] = useState<string>(propStart || '');
  const [inputEndDate, setInputEndDate] = useState<string>(propEnd || '');
  const [savedToast, setSavedToast] = useState(false);
  const remain = budget !== null ? budget - totalSpent : 0;
  const spendPercent = budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0;

  const handleSave = async () => {
    try {
      if (budget === 0) {
        await createBudget({
          category,
          totalAmount: inputAmount,
          startDate: inputStartDate || undefined,
          endDate: inputEndDate || undefined,
        });
      } else {
        await updateBudget(category, inputAmount, inputStartDate || undefined, inputEndDate || undefined);
      }
      const updatedBudget = await getBudgets(category);
      setBudget(updatedBudget.totalAmount);
      setIsEditing(false);
      setSavedToast(true);
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (error) {
      console.error('예산 저장 실패', error);
    }
  };

  useEffect(() => {
    setIsEditing(budget === 0);
  }, [budget]);

  useEffect(() => {
    if (propStart) setInputStartDate(propStart);
    if (propEnd) setInputEndDate(propEnd);
  }, [propStart, propEnd]);

  return (
    <div className="budgetlist">
      <h2>{category} 예산</h2>
      {isEditing ? (
        <>
          <div className="edit-row">
            <input
              type="number"
              placeholder="예산 금액"
              value={inputAmount}
              onChange={(e) => setInputAmount(Number(e.target.value) || 0)}
            />
            <button type="button" className="save" onClick={handleSave}>저장</button>
          </div>
          <div className="budget-date-row">
            <div className="budget-date-field">
              <label>여행 시작일</label>
              <input
                type="date"
                value={inputStartDate}
                onChange={(e) => setInputStartDate(e.target.value)}
              />
            </div>
            <div className="budget-date-field">
              <label>여행 종료일</label>
              <input
                type="date"
                value={inputEndDate}
                onChange={(e) => setInputEndDate(e.target.value)}
              />
            </div>
          </div>
          <button type="button" className="notedit" onClick={() => setIsEditing(false)}>취소</button>
        </>
      ) : (
        <>
          {budget > 0 && (
            <div className="budget-progress-wrap">
              <div className="budget-progress-bar">
                <div
                  className={`budget-progress-fill ${spendPercent >= 90 ? 'over' : ''}`}
                  style={{ width: `${spendPercent}%` }}
                />
              </div>
              <span className="budget-progress-label">예산 사용 {spendPercent}%</span>
            </div>
          )}
          <div className="budget-display">
            <div>
              <p>예산: {budget?.toLocaleString()}원</p>
              <div className="rest">남은 예산: {remain.toLocaleString()}원</div>
            </div>
            <button type="button" className="budget-edit-btn" onClick={() => setIsEditing(true)}>
              <EditIcon sx={{ fontSize: 18 }} /> 예산 수정
            </button>
          </div>
          {savedToast && <div className="toast toast-success">예산이 저장됐어요</div>}
        </>
      )}
    </div>
  );
};

export default BudgetList;
