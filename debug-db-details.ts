import { Sequelize } from "sequelize";
import configFile from "./lib/db/config.json";

async function debug() {
  const env = process.env.NODE_ENV || 'development';
  const config = (configFile as any)[env];
  
  const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    logging: false,
  });

  try {
    await sequelize.authenticate();
    const qi = sequelize.getQueryInterface();
    const cols = await qi.describeTable('Initiatives');
    console.log('Columns in Initiatives details:', JSON.stringify(cols, null, 2));
  } catch (err: any) {
    console.error('Error:', err.message);
  } finally {
    await sequelize.close();
  }
}

debug();
