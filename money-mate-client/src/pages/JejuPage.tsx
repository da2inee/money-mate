import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import BudgetList from '../components/BudgetList';
import { addExpense, getExpenses } from '../api/expenseApi';
import { getWhoExpenses } from '../api/travelerApi';
import { getBudgets } from '../api/budgetApi'; // 예산 관련 API 호출
import {whoExpenses} from '../api/travelerApi'; // 예산 관련 API 호출
import './JejuPage.css';
import MButton from '../components/common/MButton';
import { Input } from '@mui/material';

//프론트 내에서 사용하는 Expense 타입 정의
interface Expense {
  id: number;
  category: string;
  title: string;
  amount: number;
  payer: string;
}
const PAGE_SIZE=5;

//JejuPage는 함수형 컴포넌트
const JejuPage: React.FC = () => {
  const { category } = useParams<{ category:string }>();
  //지출내역을 저장하는 상태(expenses)를 생성하고, 초기값은 빈 배열임
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<number >(0); // 예산 상태 추가
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [totalSpent,setTotalSpent] =useState(0);
  const [goWith,setGoWith] = useState('');
  const [whoList, setWhoList] = useState<string[]>([]);
  const navigate = useNavigate();

  const getTotalPerPerson = (expenses: Expense[]) => {
    const result: { [name: string]: number } = {};

    expenses.forEach(({ payer, amount }) => {
      result[payer] = (result[payer] || 0) + amount;
    });

    return result;
  };

  const totalPerPerson = getTotalPerPerson(expenses);

   // 컴포넌트 마운트 시 지출 목록 불러오기
   // useEffect는 컴포넌트가 처음 마운트될 때 한 번 실행됨
   // getExpenses()를 호출해 목록을 가져오고, setExpenses()로 상태를 갱신합니다.
   useEffect(() => {
    if (category) {  // category가 존재할 때만 실행
      const fetchExpenses = async () => {
        try {
          const data = await getExpenses(category );  // 서버에서 목록 가져오기
            setExpenses((prev) => {      
              const merged = [...prev, ...data];
              const unique = Array.from(new Map(merged.map(item => [item.id, item])).values());
              return unique;
            });   // 상태에 저장
          // 예산 가져오기
          const budgetData = await getBudgets(category); // 예산 데이터 가져오기
  
          // budgetData가 객체 형태라면
          if (budgetData && budgetData.totalAmount !== undefined) {
            setBudget(budgetData.totalAmount); // 카테고리별 예산 값 설정         
          } else {     
            setBudget(0); // 예산이 없으면 0으로 설정
          }

          const whoData = await getWhoExpenses(category);
          setWhoList(whoData);

  
        } catch (err) {
          console.error('지출 목록 불러오기 실패', err);
        }
      };
      fetchExpenses();
    } else {
      console.log('category가 정의되지 않았습니다.');  // category가 없을 경우 로그 출력
    }
  }, [category]);
  
  
  

  // 지출 추가 처리
  const handleAddExpense = async (expense: Omit<Expense, 'id' | 'category'>) => {
    try {
      const completeExpense: Omit<Expense, 'id'> = {
        ...expense,
        category: category!, // 외부에서 선언된 category 값을 추가
      };
  
      await addExpense(completeExpense); // 서버에 저장
      const updatedList = await getExpenses(category);
      setExpenses(updatedList);

      // 예산은 지출을 추가했을 때 자동으로 업데이트 (예산 - 지출 금액)
      if (budget !== null) {
        const newBudget = budget - expense.amount;
        setBudget(newBudget);
      }

    } catch (err) {
      console.error('지출 추가 실패', err);
    }
  };
  const handleName = async (name: string, category: string) => {
    console.log(name);
    console.log(category);
    try {
      await whoExpenses(category, name);
      setGoWith(name);
      setGoWith('');
      console.log(goWith);   
    } catch (error) {
    }
  };

  return (
  <div className="jeju-page-container">
    <div className="header">
      <div className="back-button">
        <MButton label="뒤로가기" variant="BACK" onClick={() => navigate(-1)}
          sx={{
            fontSize: '14px',
            padding: '4px 8px',
            minWidth: 'auto',
            height: '32px',
          }} />
      </div>
      <h1 className="title">{category?.toUpperCase()} 여행 지출 관리</h1>
    </div>
    <div className="budget-expense-section">
      {category && (
        <BudgetList
          category={category}
          budget={budget}
          setBudget={setBudget}
          totalSpent={totalSpent}
        />
      )}
    <div >
        WITH
        <input
        className='with'
        placeholder='같이 간 사람'
        value={goWith}
        onChange={(e) => setGoWith(e.target.value)}
        />
        <button onClick={() => handleName(goWith, category??'')}>
          저장
        </button>
    </div>
      {/* 같이 간 사람들 보여주기 */}
      <section>
        <h3>같이 간 사람</h3>
        {whoList.length === 0 ? (
          <p>등록된 사람이 없어요.</p>
        ) : (
          <ul>
            {whoList.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        )}
      </section>

      <ExpenseForm onAdd={handleAddExpense} />
    </div>
    <div className="expense-list-wrapper">
      <h2>지출 내역</h2>
      <ExpenseList
        setTotalSpent={setTotalSpent}
        budget={budget}
        expenses={expenses}
        onDelete={async () => {
          const resetData = await getExpenses(category);
          setExpenses(resetData);
        }}
      />
    </div>

    <div className="summary-section">
      <h2>💰 정산 요약</h2>
      <ul className="summary-list">
        {Object.entries(totalPerPerson).map(([name, total]) => (
          <li key={name} className="summary-item">
            <span>{name}</span>
            <span>{total.toLocaleString()}원</span>
          </li>
        ))}
      </ul>
    </div>

    <div ref={loaderRef} />
  </div>
);

};

export default JejuPage;


