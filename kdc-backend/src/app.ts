import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
//import mongoSanitize from 'express-mongo-sanitize';
import reportRouter from './routes/resultRoute.ts';
import termRoute from './routes/createTerm.ts';
import errorHandler from './middleware/globalErrorHandler.ts';
import studentRoute from './routes/studentRoute.ts';
import staffRoute from './routes/staffRoute.ts';
import './utils/cronJob.ts';
import authRoute from './routes/authRoute.ts';
import subjectRouter from './routes/subjectRoute.ts';
import classSubjectRouter from './routes/classSubject.route.ts';
import teacherAssingRouter from './routes/assignTeacher.route.ts';
import timeTableRouter from './routes/timeTable.route.ts';
//import hpp from 'hpp'
const app = express();

app.use(helmet());
app.use(express.json());
//app.use(mongoSanitize());
//app.use(hpp)
app.use(morgan('dev'));
app.use('/api/v1/student', studentRoute);
app.use('/api/v1/result', reportRouter);
app.use('/api/v1/term', termRoute);
app.use('/api/v1/staff', staffRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/subjects', subjectRouter);
app.use('/api/v1/class-subjects', classSubjectRouter);
app.use('/api/v1/teacher-assign', teacherAssingRouter);
app.use('/api/v1/time-table', timeTableRouter);
app.use(errorHandler);

export default app;
