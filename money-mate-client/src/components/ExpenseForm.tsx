import React, { useState } from 'react';
import './ExpenseForm.css'
//import MInput from './common/MInput';

interface Props {
  onAdd: (expense: { title: string; amount: number; payer: string }) => void;
}

const ExpenseForm: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ title, amount: Number(amount), payer  });
    setTitle('');
    setAmount('');
    setPayer('');
  };

  return (
    <form className='expense-form' onSubmit={handleSubmit}>
      <input 
        placeholder="지출 항목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        placeholder="금액"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <input
        placeholder="지출자"
        value={payer}
        onChange={(e) => setPayer(e.target.value)}
        required
      />
      <button type="submit">추가</button>
    </form>
  );
};

export default ExpenseForm;
