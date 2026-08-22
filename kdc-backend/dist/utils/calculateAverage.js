const calStudentScore = (students) => {
    const returnValue = {};
    Object.entries(students).forEach((name) => {
        const studentsScore = [...name[1]];
        const studentsName = name[0];
        const sum = studentsScore.reduce((acc, n) => acc + n, 0);
        const avg = sum / studentsScore.length;
        returnValue[studentsName] = avg;
    });
    return returnValue;
};
export default calStudentScore;
//# sourceMappingURL=calculateAverage.js.map