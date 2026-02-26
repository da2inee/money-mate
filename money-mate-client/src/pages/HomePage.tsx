/**
 * HomePage.tsx - 메인 화면
 *
 * - 오늘 날짜, 제목, 한 줄 소개 표시
 * - "다른 여행 추가" 버튼 → 모달에서 이름 입력 후 해당 카테고리 페이지로 이동
 * - 기본 카테고리(제주/서울/유럽 여행) + localStorage에 저장된 사용자 추가 여행 카드
 * - 카드 클릭 시 /category/:category 로 이동
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

/** 기본으로 보여줄 여행 카테고리 (제주, 서울, 유럽 여행) */
const defaultCategories: { id: string; label: string; icon: string; color: string }[] = [
  { id: 'jeju', label: '제주', icon: '🏝️', color: 'card-teal' },
  { id: 'seoul', label: '서울', icon: '🏙️', color: 'card-sky' },
  { id: '유럽 여행', label: '유럽 여행', icon: '✈️', color: 'card-coral' },
];

const today = new Date();
const dateStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  /** 사용자가 "다른 여행 추가"로 만든 카테고리 목록 (localStorage에서 복원) */
  const [customList, setCustomList] = useState<{ id: string; label: string; icon: string; color: string }[]>(() => {
    try {
      const s = localStorage.getItem('moneyMate_categories');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [newTripName, setNewTripName] = useState('');

  /** 새 여행 추가 모달 열기 */
  const openModal = () => {
    setNewTripName('');
    setModalOpen(true);
  };

  /** 모달 닫기 */
  const closeModal = () => {
    setModalOpen(false);
    setNewTripName('');
  };

  /** 새 여행 추가 제출: customList + localStorage 갱신 후 해당 카테고리 페이지로 이동 */
  const submitNewTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newTripName.trim();
    if (!name) return;
    const id = name;
    const newItem = { id, label: id, icon: '🧳', color: 'card-teal' };
    const next = [...customList, newItem];
    setCustomList(next);
    try {
      localStorage.setItem('moneyMate_categories', JSON.stringify(next));
    } catch {}
    closeModal();
    navigate(`/category/${encodeURIComponent(id)}`);
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <span className="home-header-date">{dateStr}</span>
        <span className="home-header-badge">여행</span>
        <h1 className="page-title">어디로 떠날까요?</h1>
        <p className="page-subtitle">예산을 챙길 여행을 골라보세요</p>
        <p className="home-tagline">여행 경비를 함께 관리하고 정산해요</p>
      </header>

      <div className="home-add-section">
        <button type="button" className="add-trip-btn-large" onClick={openModal}>
          <span className="add-trip-btn-icon" aria-hidden>+</span>
          다른 여행 추가
        </button>
      </div>

      {modalOpen && (
        <div className="add-trip-modal-overlay" onClick={closeModal}>
          <div className="add-trip-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="add-trip-modal-title">🧳 새 여행 추가</h3>
            <p className="add-trip-modal-desc">여행 이름을 입력하세요</p>
            <form onSubmit={submitNewTrip}>
              <input
                type="text"
                className="add-trip-modal-input"
                placeholder="예: 부산, 일본, 제주도"
                value={newTripName}
                onChange={(e) => setNewTripName(e.target.value)}
                autoFocus
              />
              <div className="add-trip-modal-actions">
                <button type="button" className="add-trip-modal-cancel" onClick={closeModal}>
                  취소
                </button>
                <button type="submit" className="add-trip-modal-submit" disabled={!newTripName.trim()}>
                  추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <p className="home-category-label">여행 선택</p>
      <ul className="category-list">
        {defaultCategories.map(({ id, label, icon, color }, index) => (
          <li className="category-item" key={id} style={{ animationDelay: `${index * 0.08}s` }}>
            <button
              type="button"
              className={`category-btn ${color}`}
              onClick={() => navigate(`/category/${encodeURIComponent(id)}`)}
            >
              <span className="category-btn-icon">{icon}</span>
              <span className="category-btn-label">{label}</span>
            </button>
          </li>
        ))}
        {customList.map(({ id, label, icon, color }, index) => (
          <li className="category-item" key={id} style={{ animationDelay: `${(defaultCategories.length + index) * 0.08}s` }}>
            <button
              type="button"
              className={`category-btn ${color}`}
              onClick={() => navigate(`/category/${encodeURIComponent(id)}`)}
            >
              <span className="category-btn-icon">{icon}</span>
              <span className="category-btn-label">{label}</span>
            </button>
          </li>
        ))}
      </ul>
      <footer className="home-footer">MoneyMate</footer>
    </div>
  );
};

export default HomePage;
