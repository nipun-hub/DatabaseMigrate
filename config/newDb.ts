import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const newDb = new Sequelize(
  process.env.NEW_DB_NAME!,
  process.env.NEW_DB_USER!,
  process.env.NEW_DB_PASSWORD!,
  {
    host: process.env.NEW_DB_HOST,
    port: Number(process.env.NEW_DB_PORT),
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl:
        process.env.NEW_DB_SSL === "true"
          ? { rejectUnauthorized: false }
          : false,
    },
  }
);

export default newDb;
