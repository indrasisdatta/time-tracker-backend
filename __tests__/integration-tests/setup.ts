import mongoose from "mongoose";
import { conn } from "../../src/server";
import { logger } from "../../src/utils/logger";

afterAll(async () => {
  console.log("Final after all...", mongoose);
  try {
    // Connection to Mongo killed.
    await mongoose.disconnect();
    // Server connection closed.
    await conn.close();
  } catch (e) {
    logger.error("DB, server clean up error", e);
    console.error(e);
  }
});
