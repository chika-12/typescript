import cron from 'node-cron';
import { Term } from '../models/termModel.ts';

cron.schedule('0 0 * * *', async () => {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setUTCHours(23, 59, 59, 999);

  await Term.updateMany(
    {
      endDate: { $gte: startOfToday, $lte: endOfToday },
      isFinalised: false,
    },
    {
      $set: { isFinalised: true, isActive: false },
    }
  );

  console.log('Term auto-finalisation check completed');
});
