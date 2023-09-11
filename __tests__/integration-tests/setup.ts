import mongoose from "mongoose";
import { logger } from "../../src/utils/logger";

afterAll(async () => {
  try {
    // Connection to Mongo killed.
    await mongoose.disconnect();
  } catch (e) {
    logger.error("DB, server clean up error", e);
    console.error(e);
  }
});
