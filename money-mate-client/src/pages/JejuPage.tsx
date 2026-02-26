/**
 * JejuPage.tsx - 여행(카테고리)별 지출 관리 페이지
 *
 * URL: /category/:category (예: /category/jeju)
 *
 * 역할:
 * - 해당 여행의 예산 설정/수정 (BudgetList)
 * - 같이 간 사람 등록 (whoList, Traveler API)
 * - 지출 추가 (ExpenseForm) / 목록·삭제 (ExpenseList)
 * - 인당 지출 합계·정산 제안 (getSettlementSuggestions)
 */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import BudgetList from '../components/BudgetList';
import { addExpense, getExpenses, deleteName } from '../api/expenseApi';
import { getWhoExpenses, whoExpenses } from '../api/travelerApi';
import { getBudgets } from '../api/budgetApi';
import './JejuPage.css';
import MButton from '../components/common/MButton';
import { Typography } from '@mui/material';
import { getSettlementSuggestions } from '../utils/settlement';

/** 지출 한 건 타입 */
interface Expense {
  id: number;
  category: string;
  title: string;
  amount: number;
  payer: string;
}

/** 같이 간 사람 한 명 타입 */
interface Who {
  id: number;
  name: string;
}

const JejuPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budget, setBudget] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [totalSpent, setTotalSpent] = useState(0);
  const [goWith, setGoWith] = useState('');
  const [whoList, setWhoList] = useState<Who[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 2200);
    return () => clearTimeout(t);
  }, [toastMessage]);

  /** 지출 목록에서 지출자별 총액 계산 */
  const getTotalPerPerson = (expenses: Expense[]) => {
    const result: { [name: string]: number } = {};
    expenses.forEach(({ payer, amount }) => {
      result[payer] = (result[payer] || 0) + amount;
    });
    return result;
  };

  const totalPerPerson = getTotalPerPerson(expenses);
  const participantNames = whoList.map((w) => w.name);
  /** 정산 제안: "A가 B에게 N원 전달" 목록 */
  const settlementSteps = getSettlementSuggestions(
    totalPerPerson,
    participantNames,
    Object.values(totalPerPerson).reduce((a, b) => a + b, 0)
  );

  /** 마운트 시: 해당 카테고리의 지출·예산·동행자 목록 API로 불러오기 */
  useEffect(() => {
    if (category) {
      const fetchExpenses = async () => {
        try {
          const data = await getExpenses(category);
            setExpenses((prev) => {      
              const merged = [...prev, ...data];
              const unique = Array.from(new Map(merged.map(item => [item.id, item])).values());
              return unique;
            });   // 상태에 저장
          // 예산 가져오기
          const budgetData = await getBudgets(category); // 예산 데이터 가져오기
            console.log('asfafasdf')
          // budgetData가 객체 형태라면
          if (budgetData && budgetData.totalAmount !== undefined) {
            setBudget(budgetData.totalAmount); // 카테고리별 예산 값 설정   
            if(budgetData.startDate) setStartDate(budgetData.startDate);
            if(budgetData.endDate) setEndDate(budgetData.endDate);
                  
          } else {     
            setBudget(0); // 예산이 없으면 0으로 설정
          }
          console.log('whoListㄴ');
          const whoData = await getWhoExpenses(category);
          setWhoList(whoData);
          console.log('whoList',whoData);

  
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
  
      await addExpense(completeExpense);
      const updatedList = await getExpenses(category);
      setExpenses(updatedList);
      setToastMessage('지출이 추가됐어요');

      if (budget !== null) {
        const newBudget = budget - expense.amount;
        setBudget(newBudget);
      }
    } catch (err) {
      console.error('지출 추가 실패', err);
    }
  };
  const handleName = async (name: string, category: string) => {
    try {
      await whoExpenses(category, name);         // 저장하고
      const updated = await getWhoExpenses(category); // 다시 불러오기
      setWhoList(updated);                       // 상태 갱신
      setGoWith('');                             // 입력창 초기화
      console.log('업데이트된 리스트:', updated);
    } catch (error) {
      console.error('저장 또는 조회 실패', error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteName(id);
      const updated = await getWhoExpenses(category ?? ''); // 삭제 후 최신 리스트 불러오기
      setWhoList(updated);               // 상태 갱신하여 UI 리렌더링

    } catch (error) {
    }
  };

  return (
  <div className="jeju-page-container page-fade-in">
    <div className="header">
      <div className="back-button">
        <MButton label="뒤로가기" variant="BACK" onClick={() => navigate(-1)} />
      </div>
      <h1 className="title">{category?.toUpperCase()} 여행 지출 관리</h1>
    </div>
    <div className="budget-expense-section">
      {startDate && endDate && (
        <Typography>
          여행 날짜 : {startDate} ~ {endDate}
        </Typography>
      )

      }
      {category && (
        <BudgetList
          category={category}
          budget={budget}
          setBudget={setBudget}
          totalSpent={totalSpent}
          startDate={startDate || undefined}
          endDate={endDate || undefined}
        />
      )}
    <div className="with-section">
        <label>같이 간 사람</label>
        <div className="with-row">
          <input
            className="with"
            placeholder="이름 입력"
            value={goWith}
            onChange={(e) => setGoWith(e.target.value)}
          />
          <button type="button" onClick={() => handleName(goWith, category ?? '')}>
            추가
          </button>
        </div>
      </div>
      <section className="who-section">
        <h3>함께한 멤버</h3>
        {whoList.length === 0 ? (
          <p className="who-empty">함께한 멤버를 위에서 추가해 보세요.</p>
        ) : (
          <ul>
            {whoList.map((who) => (
              <li key={who.id} className="who-item">
                <span>{who.name}</span>
                <button type="button" className="delete" onClick={() => handleDelete(who.id)}>
                  삭제
                </button>
              </li>
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
      <h3 className="total">개인 사용 금액</h3>
      <ul className="summary-list">
        {Object.entries(totalPerPerson).map(([name, total]) => (
          <li key={name} className="summary-item">
            <span>{name}</span>
            <span>{total.toLocaleString()}원</span>
          </li>
        ))}
      </ul>
    </div>

    {settlementSteps.length > 0 && (
      <div className="settlement-section">
        <h2>💡 정산 제안</h2>
        <p className="settlement-desc">아래처럼 전달하면 공평하게 정산돼요.</p>
        <ul className="settlement-list">
          {settlementSteps.map((step, idx) => (
            <li key={idx} className="settlement-item">
              <span className="settlement-from">{step.from}</span>
              <span className="settlement-arrow">→</span>
              <span className="settlement-to">{step.to}</span>
              <span className="settlement-amount">{step.amount.toLocaleString()}원</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {toastMessage && (
      <div className="toast toast-success" role="status">{toastMessage}</div>
    )}
    <div ref={loaderRef} />
  </div>
);

};

export default JejuPage;


