import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import BudgetList from '../components/BudgetList';
import { addExpense, getExpenses } from '../api/expenseApi';
import { getBudgets } from '../api/budgetApi'; // 예산 관련 API 호출
import './JejuPage.css';
import MButton from '../components/common/MButton';

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
  const [budget, setBudget] = useState<number>(0); // 예산 상태 추가
  const [pageNum, setPageNum] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [totalSpent,setTotalSpent] =useState(0);
  const navigate = useNavigate();
   // 컴포넌트 마운트 시 지출 목록 불러오기
   // useEffect는 컴포넌트가 처음 마운트될 때 한 번 실행됨
   // getExpenses()를 호출해 목록을 가져오고, setExpenses()로 상태를 갱신합니다.
   useEffect(() => {
    if (category) {  // category가 존재할 때만 실행
      const fetchExpenses = async () => {
        try {
          const data = await getExpenses(category, pageNum, PAGE_SIZE );  // 서버에서 목록 가져오기
          if (data.length < PAGE_SIZE) setHasMore(false);
            setExpenses((prev) => {      
              const merged = [...prev, ...data];
              const unique = Array.from(new Map(merged.map(item => [item.id, item])).values());
              return unique;
            });   // 상태에 저장
          console.log("ㅁㄴㅇㄹ"+data)
          // 예산 가져오기
          const budgetData = await getBudgets(category); // 예산 데이터 가져오기
          console.log('budgetData:', budgetData);  // 예산 데이터 확인
  
          // budgetData가 객체 형태라면
          if (budgetData && budgetData.totalAmount !== undefined) {
            setBudget(budgetData.totalAmount); // 카테고리별 예산 값 설정
            
          } else {
            
            setBudget(0); // 예산이 없으면 0으로 설정
          }
  
        } catch (err) {
          console.error('지출 목록 불러오기 실패', err);
        }
      };
      fetchExpenses();
    } else {
      console.log('category가 정의되지 않았습니다.');  // category가 없을 경우 로그 출력
    }
  }, [pageNum, category]);
  
  
  

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
      const newBudget = budget - expense.amount;
      setBudget(newBudget); // 예산 상태 갱신

    } catch (err) {
      console.error('지출 추가 실패', err);
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prev) => {return prev + 1});
        }
      },
      { rootMargin: '100px',  // 스크롤 100px 남았을 때 미리 로딩 시도
        threshold: 0.1}
    );
    const target = loaderRef.current;
    if (target) observer.observe(target);
    return () => {
      if (target) observer.unobserve(target);
    };
  }, [hasMore]);

  return (
    <div className='top'>
    <MButton               
      label='<뒤로가기'
      variant="BACK"
      onClick={() => navigate(-1)}
    />
      <h1 className='title'>{category?.toUpperCase()} 여행 지출 관리</h1>
      {category && <BudgetList category={category} budget={budget} setBudget={setBudget} totalSpent={totalSpent}/>} 
      <ExpenseForm onAdd={handleAddExpense} />
      <ExpenseList setTotalSpent={setTotalSpent} budget={budget} expenses={expenses} onDelete={async () => {
        setPageNum(1);
        const resetData = await getExpenses(category, 1, PAGE_SIZE);
        setExpenses(resetData);
        setHasMore(true);
      }} />
      <div ref={loaderRef} />
    </div>
  );
};

export default JejuPage;


