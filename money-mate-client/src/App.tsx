/**
 * App.tsx - 앱 진입점 & 라우팅
 *
 * 경로:
 *   /              → HomePage (메인: 여행 카테고리 선택)
 *   /category/:id  → JejuPage (해당 여행의 예산·지출·정산 관리)
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JejuPage from './pages/JejuPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:category" element={<JejuPage />} />
      </Routes>
    </Router>
  );
}

export default App;
