import express from 'express';
import helmet from 'helmet';
//import mongoSanitize from 'express-mongo-sanitize';
import reportRouter from './routes/resultRoute.ts';
//import hpp from 'hpp'
const app = express();

app.use(helmet());
app.use(express.json());
//app.use(mongoSanitize());
//app.use(hpp)

app.use('/api', reportRouter);

export default app;
