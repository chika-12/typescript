const topScorer = (studentAvgScores) => {
    const topStudent = {};
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
export default topScorer;
//# sourceMappingURL=topscorer.js.map