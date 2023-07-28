// import app from "../../src/app";
import request from "supertest";
import { logger } from "../../src/utils/logger";
// import mongoose, { ConnectOptions } from "mongoose";
import server from "../../src/server";

describe("Category Integration testing", () => {
  // beforeEach(() => {
  //   mongoose.connect(process.env.DB_CON_STR!, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   } as ConnectOptions);
  // });

  // afterEach(async () => {
  //   await mongoose.connection.close();
  // });

  describe("GET /category", () => {
    it("Should return all categories", async () => {
      const response = await request(server).get("/category");
      logger.info("Response category", response);
      expect(response.type).toMatch(/json/);
      expect(response.ok).toBeTruthy();
      expect(response.body.status).toEqual(1);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  //   describe("POST /category", () => {
  //     it("Should create a new category", async () => {
  //       const categoryData = {
  //         name: "New Category",
  //         description: "Test category description",
  //         subCategories: [
  //           { name: "Subcategory 1", description: "Subcategory 1 description" },
  //         ],
  //       };

  //     });
  //   });
});
