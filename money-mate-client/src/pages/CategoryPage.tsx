import React from 'react';
import { useParams } from 'react-router-dom';

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>{categoryName} 관리 페이지</h1>
      {/* 여기서 추가 기능 (비행기, 정산 등) 추가 */}
    </div>
  );
};

export default CategoryPage;
