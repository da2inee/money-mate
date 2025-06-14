// src/components/BudgetList.tsx
import React, { useState,useEffect } from 'react';
import { createBudget, getBudgets, updateBudget } from '../api/budgetApi';
import './BudgetList.css'
import ExpenseList from './ExpenseList';
import { ExpenseListProps } from './ExpenseList';
import EditIcon from '@mui/icons-material/Edit';

export interface BudgetListProps {
  category: string;
  budget: number;
  setBudget:(value:number) => void;
  totalSpent:number;
}

const BudgetList: React.FC<BudgetListProps> = ({ category, budget, setBudget,totalSpent}) => {
  const [isEditing, setIsEditing] = useState<boolean>(budget === 0); // 예산이 없으면 편집 모드
  const [expenses, setExpenses] = useState([]); // 🔥 지출 데이터 상태 추가
  const [inputAmount, setInputAmount] = useState<number>(budget);
  const remain = budget !== null ? budget - totalSpent : 0;

  const handleSave = async () => {
    try {
      if (budget === 0) {
        // 새 예산 저장
        await createBudget({ category, totalAmount: inputAmount });
      } else {
        // 기존 예산 수정
        await updateBudget(category, inputAmount);
      }
      const updatedBudget = await getBudgets(category);
      setBudget(updatedBudget.totalAmount); // ⬅️ 부모 상태 갱신
      setIsEditing(false);
      window.location.reload(); // 변경 내용 반영 위해 새로고침
    } catch (error) {
      console.error('예산 저장 실패', error);
    }
  };

  useEffect(() => {
    setIsEditing(budget === 1);
    console.log('adf');
  }, [budget]);

  return (
    <div className='budgetlist'>
      <h2>{category} 카테고리 예산</h2>
      {isEditing ? (
        <>
        <div>
          <input
            type="number"
            placeholder='0'
            onChange={(e) => setInputAmount(Number(e.target.value))}
          />
          <button className='save' onClick={handleSave}>저장</button>
          
        </div>
        <button className='notedit' onClick={() =>setIsEditing(false)} >수정 안하기</button>
        </>
      ) : (
        <div>
          <p>예산 : {budget?.toLocaleString()} 원</p>
          <EditIcon/>
          <button onClick={() => setIsEditing(true)}>예산 수정하기</button>
          <div className='rest'>남은 예산 : {remain} 원</div>
        </div>
      )}


  
    </div>
  );
};

export default BudgetList;
