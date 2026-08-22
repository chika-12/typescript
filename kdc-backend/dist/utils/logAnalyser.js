const logs = [
    'USER:chika|ACTION:login|TIME:08:30|EMAIL:chika@gmail.com',
    'USER:mary|ACTION:purchase|TIME:09:10|EMAIL:mary@yahoo.com',
    'USER:peter|ACTION:login|TIME:09:45|EMAIL:peter@outlook.com',
    'USER:chika|ACTION:logout|TIME:10:15|EMAIL:chika@gmail.com',
    'USER:mary|ACTION:login|TIME:10:20|EMAIL:mary@invalid',
    'USER:john|ACTION:signup|TIME:11:00|EMAIL:john.doe@gmail.com',
    'USER:ada|ACTION:purchase|TIME:11:30|EMAIL:ada123@domain.com',
    'USER:peter|ACTION:logout|TIME:12:00|EMAIL:peter@outlook.com',
    'USER:chika|ACTION:login|TIME:12:10|EMAIL:chika@gmail.com',
    'USER:john|ACTION:login|TIME:12:45|EMAIL:john.doe@gmail.com',
];
export const logSplitter = (logs) => {
    const splitLogs = [];
    logs.forEach((arr) => {
        splitLogs.push(arr.split('|'));
    });
    return splitLogs;
};
// const keyMap: Record<string, keyof Log> = {
//   user: 'user',
//   action: 'action',
//   time: 'time',
//   email: 'email',
// };
export const objectCreator = (arrayLogs) => {
    const returnValue = [];
    arrayLogs.forEach((arr) => {
        const obj = {};
        arr.forEach((arr2) => {
            let arr3 = arr2.split(':');
            const key = arr3[0].toLowerCase();
            const value = arr3[1];
            if (key === 'user') {
                obj.user = value;
            }
            else if (key === 'action') {
                obj.action = value;
            }
            else if (key === 'email') {
                obj.email = value;
            }
            else if (key === 'time') {
                obj.time = value;
            }
        });
        const email = obj.email ?? '';
        obj.isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        returnValue.push(obj);
    });
    return returnValue;
};
//# sourceMappingURL=logAnalyser.js.map