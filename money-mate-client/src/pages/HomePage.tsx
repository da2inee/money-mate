import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'
import MButton from '../components/common/MButton';

const categories: string[] = ['jeju', 'seoul', '유럽 여행'];

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const onclickbutton = (category: string) => {
        navigate(`/category/${category}`)
    }   

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 className='home'>여행 카테고리</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {categories.map((category, index) => (
          <li className="category" key={index} style={{ margin: '20px 0' }}>
            <MButton               
              label={category}
              variant="CATEGORY"
              onClick={() => onclickbutton(category)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
