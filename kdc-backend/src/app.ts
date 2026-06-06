import express from 'express';
import helmet from 'helmet';
//import mongoSanitize from 'express-mongo-sanitize';
import reportRouter from './routes/resultRoute.ts';
import termRoute from './routes/createTerm.ts';
import errorHandler from './middleware/globalErrorHandler.ts';
import studentRoute from './routes/studentRoute.ts';
import './utils/cronJob.ts';
//import hpp from 'hpp'
const app = express();

app.use(helmet());
app.use(express.json());
//app.use(mongoSanitize());
//app.use(hpp)

// app.post('/api/v1/student/register', (req, res) => {
//   res.json({ hit: true });
// });

app.use('/api/v1/student', studentRoute);
app.use('/api/v1/result', reportRouter);
app.use('/api/v1/term', termRoute);

app.use(errorHandler);

export default app;
