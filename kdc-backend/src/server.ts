import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']); // force Google DNS
import app from './app.ts';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: './config.env' });
const port = process.env.PORT || 3000;

const DB = process.env.DATABASE?.replace('<PASSWORD>', process.env.PASSWORD!);

if (!DB) {
  throw new Error('DATABASE is not defined in env');
}
mongoose
  .connect(DB)
  .then(() => {
    console.log('Database connected');
    app.listen(port, () => {
      console.log(`app running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('DB connection failed:', err);
  });
