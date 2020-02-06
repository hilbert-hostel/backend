import * as dotenv from "dotenv";

dotenv.config();

export default {
  PORT: process.env.PORT as string,
  NODE_ENV: process.env.NODE_ENV as string
};
