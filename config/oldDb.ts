import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const oldDb = new Sequelize(
  process.env.OLD_DB_NAME!,
  process.env.OLD_DB_USER!,
  process.env.OLD_DB_PASSWORD!,
  {
    host: process.env.OLD_DB_HOST,
    port: Number(process.env.OLD_DB_PORT),
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl:
        process.env.OLD_DB_SSL === "true"
          ? { rejectUnauthorized: false }
          : false,
    },
  }
);

export default oldDb;
