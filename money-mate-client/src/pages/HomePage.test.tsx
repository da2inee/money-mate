/**
 * HomePage 단위 테스트
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import HomePage from './HomePage';

// react-router-dom useNavigate mock
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('HomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('메인 제목이 렌더링된다', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText(/어디로 떠날까요/i)).toBeInTheDocument();
  });

  it('다른 여행 추가 버튼이 있다', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByRole('button', { name: /다른 여행 추가/i })).toBeInTheDocument();
  });

  it('기본 카테고리 카드가 보인다', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('제주')).toBeInTheDocument();
    expect(screen.getByText('서울')).toBeInTheDocument();
    expect(screen.getByText('유럽 여행')).toBeInTheDocument();
  });

  it('다른 여행 추가 버튼 클릭 시 모달이 열린다', () => {
    renderWithRouter(<HomePage />);
    fireEvent.click(screen.getByRole('button', { name: /다른 여행 추가/i }));
    expect(screen.getByText(/새 여행 추가/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/예: 부산/i)).toBeInTheDocument();
  });

  it('카테고리 카드 클릭 시 해당 경로로 이동한다', () => {
    renderWithRouter(<HomePage />);
    fireEvent.click(screen.getByText('제주'));
    expect(mockNavigate).toHaveBeenCalledWith('/category/jeju');
  });
});
