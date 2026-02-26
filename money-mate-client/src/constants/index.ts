/**
 * MoneyMate 상수
 *
 * API URL, 라우트 경로, localStorage 키, 기본값 등 앱 전역에서 쓰는 상수입니다.
 */

/** API 베이스 URL (개발: localhost:8080, 프로덕션은 환경 변수 등으로 오버라이드) */
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8080';

/** 지출 API 경로 */
export const EXPENSES_PATH = '/expenses';

/** 예산 API 경로 prefix */
export const BUDGET_PATH = '/budget';

/** 동행자(카테고리) API 경로 */
export const CATEGORY_PATH = '/category';

/** localStorage 키: 사용자 추가 여행 카테고리 목록 */
export const STORAGE_KEY_CATEGORIES = 'moneyMate_categories';

/** 라우트 경로 */
export const ROUTES = {
  HOME: '/',
  CATEGORY: '/category/:category',
  categoryById: (id: string) => `/category/${encodeURIComponent(id)}`,
} as const;

/** 기본 여행 카테고리 ID (라벨과 동일할 수 있음) */
export const DEFAULT_CATEGORY_IDS = ['jeju', 'seoul', '유럽 여행'] as const;

/** 토스트 표시 시간 (ms) */
export const TOAST_DURATION_MS = 2200;

/** 정산 제안에서 무시하는 최소 차이 (원). 이보다 작은 차이는 0으로 봄 */
export const SETTLEMENT_MIN_DIFF = 10;
