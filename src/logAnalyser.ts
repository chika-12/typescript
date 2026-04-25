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

const logSplitter = (logs: string[]): string[][] => {
  const splitLogs: string[][] = [];
  logs.forEach((arr) => {
    splitLogs.push(arr.split('|'));
  });
  return splitLogs;
};

type Log = {
  user: string;
  action: string;
  time: string;
  email: string;
};

const objectCreator = (arrayLogs: string[][]): Log[] => {
  const returnValue: Log[] = [];
  arrayLogs.forEach((arr) => {
    const obj: Partial<Log> = {};
    arr.forEach((arr2) => {
      let arr3 = arr2.split(':');
      obj[arr3[0].toLowerCase() as keyof Log] = arr3[1].toLowerCase();
    });
    returnValue.push(obj as Log);
  });
  return returnValue;
};

console.log(objectCreator(logSplitter(logs)));
