/**
 * ExpenseForm.tsx - 지출 추가 폼
 *
 * - 항목명, 금액, 지출자 입력 후 제출 시 onAdd(지출) 호출
 * - (선택) 엑셀 파일 업로드 필드 존재 (checkFileChange 연동)
 */
import React, { useState } from 'react';
import './ExpenseForm.css';
import { FormControl, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { checkFileChange } from './etc';

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

  const [excelFileName, setExcelFileName] = useState('');

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="field-group">
          <label>지출 항목</label>
          <input
            placeholder="예: 맛집, 교통비"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="field-group">
          <label>금액 (원)</label>
          <input
            placeholder="0"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <div className="quick-amounts">
            {[10000, 20000, 50000, 100000].map((n) => (
              <button
                key={n}
                type="button"
                className="quick-amount-btn"
                onClick={() => setAmount(String(n))}
              >
                {n >= 10000 ? `${n / 10000}만` : n}
              </button>
            ))}
          </div>
        </div>
        <div className="field-group">
          <label>지출자</label>
          <input
            placeholder="이름"
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            required
          />
        </div>
        <div className="submit-row">
          <button type="submit">추가</button>
        </div>
      </div>
      <div className="excel-upload">
        <FormControl sx={{ width: '100%' }} variant="outlined">
          <OutlinedInput
            value={excelFileName}
            placeholder="엑셀 파일로 일괄 등록 (선택)"
            readOnly
            onClick={() => document.getElementById('excel-popp-upload-input')?.click()}
            endAdornment={
              <InputAdornment position="end">
                <IconButton edge="end" size="small" />
              </InputAdornment>
            }
          />
          <input
            id="excel-popp-upload-input"
            type="file"
            accept=".xlsx,.xls"
            style={{ display: 'none' }}
            onChange={(e) => { checkFileChange(e); setExcelFileName(e.target.files?.[0]?.name ?? ''); }}
            onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
          />
        </FormControl>
      </div>
    </form>
  );
};

export default ExpenseForm;
