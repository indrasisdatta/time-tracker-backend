// import app from "../../src/app";
import request from "supertest";
import { logger } from "../../src/utils/logger";
// import mongoose, { ConnectOptions } from "mongoose";
import server from "../../src/server";
import { Category, ISubCategory } from "../../src/models/Category";

describe("Category Integration testing", () => {
  const uid = new Date().getTime();
  const categoryPayload = {
    name: `Category integration test ${uid}`,
    description: `Category integration test description ${uid}`,
    subCategories: [
      {
        name: `Subcategory integration test ${uid}`,
        description: `Subcategory integration test description ${uid}`,
      },
    ],
  };
  let createdRecords: string[] = [];
  let createdSubcategories: ISubCategory[] = [];

  beforeEach(() => {
    jest.setTimeout(60000);
  });

  afterEach(async () => {
    logger.info(`Created records: ${JSON.stringify(createdRecords)}`);
    logger.info(
      `Created subcategories: ${JSON.stringify(createdSubcategories)}`
    );
  });

  /* Clean up in afterAll hook */
  // afterAll(async () => {
  //   try {
  //     const delRes = await Category.deleteMany({
  //       _id: { $in: createdRecords },
  //     });
  //     console.log("Delete response: ", delRes);
  //   } catch (e: any) {
  //     logger.error(`Error deleting category: ${e.getMessage()}`);
  //   }
  // });

  describe("GET /category", () => {
    it("Should return all categories", async () => {
      const response = await request(server).get("/category");
      logger.info("Category list response: ", response);
      expect(response.type).toMatch(/json/);
      expect(response.statusCode).toEqual(200);
      expect(response.body.status).toEqual(1);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("POST /category", () => {
    it("Should create a new category", async () => {
      const response = await request(server)
        .post("/category")
        .send(categoryPayload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      logger.info("Category add success response: ", response);
      createdRecords.push(response.body.data._id);
      createdSubcategories = [
        ...createdSubcategories,
        ...response.body.data.subCategories,
      ];
      // createdSubcategories.push(response.body.data.subCategories);
      expect(response.type).toMatch(/json/);
      expect(response.statusCode).toEqual(200);
      expect(response.body.status).toEqual(1);
      expect(response.body.data).toBeTruthy();
    });

    it("Should return required validation error", async () => {
      const payload = {
        name: "",
        subCategories: [{ name: "" }],
      };
      const response = await request(server)
        .post("/category")
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      logger.info("Category add validation error response: ", response);

      expect(response.type).toMatch(/json/);
      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toEqual(0);
      expect(response.body.error).toHaveLength(2);
    });

    it("Should return unique category name error", async () => {
      const response = await request(server)
        .post("/category")
        .send(categoryPayload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");

      logger.info("Category unique name error response: ", response);

      expect(response.type).toMatch(/json/);
      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toEqual(0);
      expect(response.body.error).toHaveLength(1);
      expect(response.body.error[0]).toMatch(/Category name already exists/);
    });
  });

  describe("PUT /category", () => {
    it("Should update category successfully", async () => {
      const payload = JSON.parse(JSON.stringify(categoryPayload));
      payload.description += " edited";
      payload.subCategories[0]._id = createdSubcategories[0]._id;
      payload.subCategories[0].description += " edited";
      payload.subCategories.push({
        name: "Subcategory integration test 2",
        description: "Subcategory integration test 2 description",
      });
      const response = await request(server)
        .put(`/category/${createdRecords[0]}`)
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      expect(response.type).toMatch(/json/);
      expect(response.statusCode).toEqual(200);
      expect(response.body.status).toEqual(1);
      expect(response.body.data).toBeTruthy();
      expect(response.body.data._id).toEqual(createdRecords[0]);
    });

    // it("Should return invalid category error", async () => {
    //   const response = await request(server)
    //     .put(`/category/64c351680e00ca26c3b63863`)
    //     .send(categoryPayload)
    //     .set("Content-Type", "application/json")
    //     .set("Accept", "application/json");
    //   expect(response.type).toMatch(/json/);
    //   expect(response.statusCode).toEqual(400);
    //   expect(response.body.status).toEqual(0);
    //   expect(response.body.error).toHaveLength(1);
    //   expect(response.body.error[0]).toMatch(/invalid/);
    // });

    it("Should return required validation error", async () => {
      // Required validation
      const payload = {
        name: "",
        subCategories: [{ name: "" }],
      };
      const response = await request(server)
        .put(`/category/${createdRecords[0]}`)
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      expect(response.type).toMatch(/json/);
      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toEqual(0);
      expect(response.body.error).toHaveLength(2);
    });

    it("Should return unique name validation error", async () => {
      // Category name unique validation
      const category = await Category.findOne({});
      const payload = JSON.parse(JSON.stringify(categoryPayload));
      payload.name = category?.name;
      const response = await request(server)
        .put(`/category/${createdRecords[0]}`)
        .send(payload)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      expect(response.type).toMatch(/json/);
      expect(response.statusCode).toEqual(400);
      expect(response.body.status).toEqual(0);
      expect(response.body.error).toHaveLength(1);
      expect(response.body.error[0]).toMatch(/Category name already exists/);
    });
  });
});
