import {
  LEVELS,
  MULTIPLIERS,
  MIN_BET,
  MAX_BET,
  BET_STEP,
  RESULTS,
  formatScore,
  formatMultiplier,
} from './data';

export const BET_ERROR =
  'Mức cược phải là bội số của 100, từ 100 đến 500 và không vượt quá số điểm đang có';

// Trả về câu báo lỗi, hoặc chuỗi rỗng nếu mức cược hợp lệ
export const validateBet = (bet, score) => {
  const value = Number(bet);
  const isValid =
    String(bet).trim() !== '' &&
    Number.isInteger(value) &&
    value % BET_STEP === 0 &&
    value >= MIN_BET &&
    value <= MAX_BET &&
    value <= score;
  return isValid ? '' : BET_ERROR;
};

// Số điểm cộng (đúng) hoặc trừ (sai / hết giờ)
export const calcChange = (bet, level, correct) => (correct ? bet * MULTIPLIERS[level] : -bet);

// Mục đầu tiên trong RESULTS có điểm >= min
export const getResult = (score) => RESULTS.find((item) => score >= item.min);

// Mức cược cao nhất được phép: số nhỏ hơn giữa 500 và số điểm đang có, làm tròn xuống bội số của 100
export const getMaxBet = (score) => Math.floor(Math.min(MAX_BET, score) / BET_STEP) * BET_STEP;

// "Câu 6/12 · CSS · Trung bình (x1,5)"
export const formatMeta = (number, total, question) =>
  `Câu ${number}/${total} · ${question.topic} · ${LEVELS[question.level]} (${formatMultiplier(
    MULTIPLIERS[question.level]
  )})`;

// "+450 điểm" hoặc "−300 điểm"
export const formatChange = (change) =>
  `${change >= 0 ? '+' : '−'}${formatScore(Math.abs(change))}`;
