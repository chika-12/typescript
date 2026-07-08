export const calculateGrade = (finalScore: number): string => {
  // 90-100 → A1
  // 80-89  → B2
  // 70-79  → B3
  // 60-69  → C4
  // 50-59  → C5
  // 45-49  → C6
  // 40-44  → D7
  // 0-39   → F9
  if (finalScore >= 90 && finalScore <= 100) return 'A1';
  if (finalScore >= 80) return 'B2';
  if (finalScore >= 70) return 'B3';
  if (finalScore >= 60) return 'C4';
  if (finalScore >= 50) return 'C5';
  if (finalScore >= 45) return 'C6';
  if (finalScore >= 40) return 'D7';
  if (finalScore >= 0) return 'F9';
  return 'Invalid';
};
