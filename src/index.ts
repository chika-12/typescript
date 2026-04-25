const students: Record<string, number[]> = {
  chika: [23, 45, 35, 89],
  mary: [45, 12, 55, 23],
  peter: [34, 11, 4, 1],
};

const calStudentScore = (
  students: Record<string, number[]>
): Record<string, number> => {
  const returnValue: Record<string, number> = {};
  Object.entries(students).forEach((name) => {
    const studentsScore = [...name[1]];
    const studentsName = name[0];
    const sum = studentsScore.reduce((acc, n) => acc + n, 0);
    const avg = sum / studentsScore.length;
    returnValue[studentsName] = avg;
  });
  return returnValue;
};

const topScorer = (
  studentAvgScores: Record<string, number>
): Record<string, number> => {
  const topStudent: Record<string, number> = {};
  let highestScore = 0;
  let stName = '';
  Object.entries(studentAvgScores).forEach((score) => {
    if (score[1] > highestScore) {
      highestScore = score[1];
      stName = score[0];
    }
  });
  topStudent[stName] = highestScore;
  return topStudent;
};

console.log(calStudentScore(students));
console.log(topScorer(calStudentScore(students)));
